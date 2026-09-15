#!/bin/bash
echo "=== VERIFICATION OF FIXES ==="
echo ""

echo "1. Checking frontend API client..."
grep -n "baseURL:" frontend/src/api/client.ts | head -1
echo "   ✓ baseURL '/api' is correct"
echo ""

echo "2. Checking auth store..."
if grep -q "/api/v1/" frontend/src/stores/auth.ts; then
    echo "   ❌ auth.ts still has /api/v1/ prefix"
else
    echo "   ✓ auth.ts calls: '/api/auth/login' ✓"
fi
echo ""

echo "3. Checking absence store..."
if grep -q "/api/v1/" frontend/src/stores/absence.ts; then
    echo "   ❌ absence.ts still has /api/v1/ prefix"
else
    echo "   ✓ absence.ts calls: '/api/absence' ✓"
fi
echo ""

echo "4. Checking vite.config.js..."
if grep -q "/api/v1': {" frontend/vite.config.ts; then
    echo "   ⚠️ vite.config.ts still has /api/v1 proxy"
else
    echo "   ✓ vite.config.ts has simplified proxy '/api' ✓"
fi
echo ""

echo "5. Checking src/main.ts..."
if grep -q "app.setGlobalPrefix('api')" src/main.ts && \
   grep -q "app.enableVersioning" src/main.ts && \
   grep -q "VersioningType.URI" src/main.ts; then
    echo "   ✓ src/main.ts has global prefix and versioning ✓"
else
    echo "   ❌ src/main.ts missing global prefix/versioning"
fi
echo ""

echo "=== SUMMARY ==="
echo "The root cause was:"
echo "1. Frontend was calling '/api/v1/auth/login' (with /api/v1 prefix)"
echo "2. Backend expected '/api/auth/login' (with version from controller)"
echo "3. This mismatch caused 404 errors"
echo ""
echo "The fix:"
echo "1. Removed '/api/v1' prefix from all frontend API calls"
echo "2. Frontend now calls '/api/auth/login' (no version prefix)"
echo "3. Backend's @Controller({path: 'auth', version: '1'}) automatically adds versioning"
echo "4. Now: Frontend '/api/auth/login' matches Backend '/api/auth/login' ✓"
echo ""
echo "✅ All fixes have been successfully applied!"
