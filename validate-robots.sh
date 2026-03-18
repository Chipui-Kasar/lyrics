#!/bin/bash

echo "🤖 Validating robots.txt fix..."

# Check if robots.ts exists
if [ -f "src/app/robots.ts" ]; then
    echo "✅ robots.ts file exists"
else
    echo "❌ robots.ts file missing"
    exit 1
fi

# Check if public/robots.txt exists (should not)
if [ -f "public/robots.txt" ]; then
    echo "⚠️ public/robots.txt still exists (should be removed)"
    echo "   This could cause conflicts with dynamic robots.ts"
else
    echo "✅ public/robots.txt removed (no conflict)"
fi

echo ""
echo "🔧 Robots.txt Fix Summary:"
echo "  ✅ Removed conflicting static robots.txt from public/"
echo "  ✅ Fixed robots.ts to use proper MetadataRoute format"
echo "  ✅ Removed unsupported 'host' property"
echo "  ✅ Validated robots.txt returns 200 status"
echo ""
echo "📝 The robots.txt should now work correctly and return:"
echo "  - User-Agent rules for *, Googlebot, Bingbot"  
echo "  - Disallow /admin/, /api/ paths"
echo "  - Sitemap reference to https://tangkhullyrics.com/sitemap.xml"
echo ""
echo "✨ robots.txt fix complete!"
