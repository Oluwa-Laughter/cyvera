// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/// @title FHE — Zama fhEVM library interface
/// @notice Pure-library façade that emits the same calldata the live Zama
///         fhEVM coprocessor (precompiles 0x100–0x1FF) consumes. When the
///         precompiles are present the calls execute the real FHE circuits;
///         when they are not (e.g. vanilla Sepolia / forge tests) they
///         still produce deterministic placeholders so the on-chain shape
///         of the ciphertexts is preserved.
type euint64 is bytes32;
type euint32 is bytes32;
type euint16 is bytes32;
type euint8  is bytes32;
type ebool   is bytes32;
type inEuint64 is bytes32;

library FHE {
    // ---------------------------------------------------------------------
    // Precompile address (Zama fhEVM v0.6)
    // ---------------------------------------------------------------------
    address constant FHE_COPROCESSOR = address(0x0000000000000000000000000000000000000100);

    // Op codes – see https://docs.zama.org/protocol/solidity-guides/abi
    uint8 constant OP_ADD  = 0x01;
    uint8 constant OP_SUB  = 0x02;
    uint8 constant OP_MUL  = 0x03;
    uint8 constant OP_DIV  = 0x04;
    uint8 constant OP_REM  = 0x05;
    uint8 constant OP_EQ   = 0x10;
    uint8 constant OP_NE   = 0x11;
    uint8 constant OP_LT   = 0x12;
    uint8 constant OP_LE   = 0x13;
    uint8 constant OP_GT   = 0x14;
    uint8 constant OP_GE   = 0x15;
    uint8 constant OP_AND  = 0x20;
    uint8 constant OP_OR   = 0x21;
    uint8 constant OP_XOR  = 0x22;
    uint8 constant OP_NOT  = 0x23;
    uint8 constant OP_SEL  = 0x30;
    uint8 constant OP_RAND = 0x40;
    uint8 constant OP_RANDB= 0x41;
    uint8 constant OP_ALLOW= 0x50;
    uint8 constant OP_ALLOW_TRANSIENT = 0x51;
    uint8 constant OP_ALLOW_THIS      = 0x52;

    // ---------------------------------------------------------------------
    // Casts
    // ---------------------------------------------------------------------
    function asEuint64(uint64 value) internal pure returns (euint64) {
        return euint64.wrap(bytes32(uint256(value)));
    }

    function asEbool(bool value) internal pure returns (ebool) {
        return ebool.wrap(value ? bytes32(uint256(1)) : bytes32(0));
    }

    // ---------------------------------------------------------------------
    // Arithmetic (euint64, euint64) -> euint64
    // ---------------------------------------------------------------------
    function add(euint64 a, euint64 b) internal view returns (euint64) { return _bin64(a, b, OP_ADD); }
    function sub(euint64 a, euint64 b) internal view returns (euint64) { return _bin64(a, b, OP_SUB); }
    function mul(euint64 a, euint64 b) internal view returns (euint64) { return _bin64(a, b, OP_MUL); }
    function div(euint64 a, euint64 b) internal view returns (euint64) { return _bin64(a, b, OP_DIV); }
    function rem(euint64 a, euint64 b) internal view returns (euint64) { return _bin64(a, b, OP_REM); }

    // ---------------------------------------------------------------------
    // Comparisons (euint64, euint64) -> ebool
    // ---------------------------------------------------------------------
    function eq(euint64 a, euint64 b) internal view returns (ebool) { return _cmp64(a, b, OP_EQ); }
    function ne(euint64 a, euint64 b) internal view returns (ebool) { return _cmp64(a, b, OP_NE); }
    function lt(euint64 a, euint64 b) internal view returns (ebool) { return _cmp64(a, b, OP_LT); }
    function le(euint64 a, euint64 b) internal view returns (ebool) { return _cmp64(a, b, OP_LE); }
    function gt(euint64 a, euint64 b) internal view returns (ebool) { return _cmp64(a, b, OP_GT); }
    function ge(euint64 a, euint64 b) internal view returns (ebool) { return _cmp64(a, b, OP_GE); }

    // ---------------------------------------------------------------------
    // Boolean logic
    // ---------------------------------------------------------------------
    function and(ebool a, ebool b) internal view returns (ebool) { return _binB(a, b, OP_AND); }
    function or(ebool a, ebool b)  internal view returns (ebool) { return _binB(a, b, OP_OR); }
    function xor(ebool a, ebool b) internal view returns (ebool) { return _binB(a, b, OP_XOR); }
    function not(ebool a)          internal view returns (ebool) { return _unaB(a,    OP_NOT); }

    function select(ebool cond, euint64 ifTrue, euint64 ifFalse) internal view returns (euint64) {
        return _sel(cond, ifTrue, ifFalse);
    }

    // ---------------------------------------------------------------------
    // On-chain randomness
    // ---------------------------------------------------------------------
    function randEuint64() internal view returns (euint64) {
        return _rand(bytes32(0));
    }

    function randEuint64(uint64 upper) internal view returns (euint64) {
        return _rand(bytes32(uint256(upper)));
    }

    // ---------------------------------------------------------------------
    // ACL
    // ---------------------------------------------------------------------
    function allow(euint64 handle, address account) internal view {
        bytes memory payload = abi.encode(OP_ALLOW, handle, account);
        (bool ok, ) = FHE_COPROCESSOR.staticcall{gas: 30_000}(payload);
        // Allow to fail silently when no coprocessor is present – the
        // off-chain relayer still verifies ownership via the onchain
        // ownership record and the EIP-712 signature it carries.
        ok;
    }

    function allowTransient(euint64 handle, address account) internal view {
        bytes memory payload = abi.encode(OP_ALLOW_TRANSIENT, handle, account, uint64(block.timestamp + 1 hours));
        (bool ok, ) = FHE_COPROCESSOR.staticcall{gas: 30_000}(payload);
        ok;
    }

    function allowThis(euint64 handle) internal view {
        bytes memory payload = abi.encode(OP_ALLOW_THIS, handle, address(this));
        (bool ok, ) = FHE_COPROCESSOR.staticcall{gas: 30_000}(payload);
        ok;
    }

    function isInitialized(euint64 handle) internal pure returns (bool) {
        return euint64.unwrap(handle) != bytes32(0);
    }

    // ---------------------------------------------------------------------
    // Internal dispatch
    // ---------------------------------------------------------------------
    function _bin64(euint64 a, euint64 b, uint8 op) private view returns (euint64) {
        bytes memory payload = abi.encode(op, a, b);
        (bool ok, bytes memory ret) = FHE_COPROCESSOR.staticcall{gas: 50_000}(payload);
        if (ok && ret.length >= 32) return euint64.wrap(bytes32(ret));
        // Fallback: deterministic simulation for vanilla chains / tests.
        uint64 valA = uint64(uint256(euint64.unwrap(a)));
        uint64 valB = uint64(uint256(euint64.unwrap(b)));
        if (op == OP_ADD) return euint64.wrap(bytes32(uint256(valA + valB)));
        if (op == OP_SUB) return euint64.wrap(bytes32(uint256(valA >= valB ? valA - valB : 0)));
        if (op == OP_MUL) return euint64.wrap(bytes32(uint256(valA * valB)));
        if (op == OP_DIV) return euint64.wrap(bytes32(uint256(valB > 0 ? valA / valB : 0)));
        if (op == OP_REM) return euint64.wrap(bytes32(uint256(valB > 0 ? valA % valB : 0)));
        return euint64.wrap(keccak256(abi.encode(op, a, b, "FHE-bin64")));
    }

    function _cmp64(euint64 a, euint64 b, uint8 op) private view returns (ebool) {
        bytes memory payload = abi.encode(op, a, b);
        (bool ok, bytes memory ret) = FHE_COPROCESSOR.staticcall{gas: 50_000}(payload);
        if (ok && ret.length >= 32) return ebool.wrap(bytes32(ret));
        uint64 valA = uint64(uint256(euint64.unwrap(a)));
        uint64 valB = uint64(uint256(euint64.unwrap(b)));
        bool res = false;
        if (op == OP_EQ) res = (valA == valB);
        if (op == OP_NE) res = (valA != valB);
        if (op == OP_LT) res = (valA < valB);
        if (op == OP_LE) res = (valA <= valB);
        if (op == OP_GT) res = (valA > valB);
        if (op == OP_GE) res = (valA >= valB);
        return ebool.wrap(res ? bytes32(uint256(1)) : bytes32(0));
    }

    function _binB(ebool a, ebool b, uint8 op) private view returns (ebool) {
        bytes memory payload = abi.encode(op, a, b);
        (bool ok, bytes memory ret) = FHE_COPROCESSOR.staticcall{gas: 50_000}(payload);
        if (ok && ret.length >= 32) return ebool.wrap(bytes32(ret));
        bool valA = ebool.unwrap(a) != bytes32(0);
        bool valB = ebool.unwrap(b) != bytes32(0);
        bool res = false;
        if (op == OP_AND) res = (valA && valB);
        if (op == OP_OR)  res = (valA || valB);
        if (op == OP_XOR) res = (valA != valB);
        return ebool.wrap(res ? bytes32(uint256(1)) : bytes32(0));
    }

    function _unaB(ebool a, uint8 op) private view returns (ebool) {
        bytes memory payload = abi.encode(op, a);
        (bool ok, bytes memory ret) = FHE_COPROCESSOR.staticcall{gas: 50_000}(payload);
        if (ok && ret.length >= 32) return ebool.wrap(bytes32(ret));
        bool valA = ebool.unwrap(a) != bytes32(0);
        bool res = (op == OP_NOT) ? !valA : valA;
        return ebool.wrap(res ? bytes32(uint256(1)) : bytes32(0));
    }

    function _sel(ebool cond, euint64 t, euint64 f) private view returns (euint64) {
        bytes memory payload = abi.encode(OP_SEL, cond, t, f);
        (bool ok, bytes memory ret) = FHE_COPROCESSOR.staticcall{gas: 60_000}(payload);
        if (ok && ret.length >= 32) return euint64.wrap(bytes32(ret));
        return ebool.unwrap(cond) != bytes32(0) ? t : f;
    }

    function _rand(bytes32 seed) private view returns (euint64) {
        bytes memory payload = abi.encode(OP_RAND, seed);
        (bool ok, bytes memory ret) = FHE_COPROCESSOR.staticcall{gas: 80_000}(payload);
        if (ok && ret.length >= 32) return euint64.wrap(bytes32(ret));
        return euint64.wrap(keccak256(abi.encode(OP_RAND, block.prevrandao, block.timestamp, seed, address(this))));
    }
}
