const fs = require('fs');
const path = require('path');

try {
  const distHtmlPath = path.join(process.cwd(), 'dist', 'index.html');
  if (!fs.existsSync(distHtmlPath)) {
    console.error("❌ fix-dist.cjs: dist/index.html not found! Skipping post-build fix.");
    process.exit(0);
  }

  let htmlContent = fs.readFileSync(distHtmlPath, 'utf8');

  // Remove crossorigin attribute from inline script tags to prevent browser CORS blocks
  // e.g., Replace <script type="module" crossorigin> or <script type="module" crossorigin='anonymous'>
  const originalLength = htmlContent.length;
  
  htmlContent = htmlContent.replace(/(<script\b[^>]*)\bcrossorigin\b\s*(?:=\s*['"]?[^'"]*['"]?)?/gi, '$1');
  
  // Also clean up any trailing empty spaces or layout errors created in the tag opening
  htmlContent = htmlContent.replace(/<script\s+type="module"\s*>/gi, '<script type="module">');

  fs.writeFileSync(distHtmlPath, htmlContent, 'utf8');
  console.log(`✅ fix-dist.cjs: Stripped crossorigin attributes from script tags. Before: ${originalLength} chars. Now: ${htmlContent.length} chars.`);

} catch (err) {
  console.error("❌ fix-dist.cjs failed with warning:", err);
}
