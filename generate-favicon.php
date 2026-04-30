<?php
// Simple PHP script to generate a favicon
if (extension_loaded('gd')) {
    // Create a 32x32 image
    $img = imagecreate(32, 32);
    
    // Define colors
    $red = imagecolorallocate($img, 220, 38, 38); // #dc2626
    $white = imagecolorallocate($img, 255, 255, 255);
    
    // Fill background with red
    imagefill($img, 0, 0, $red);
    
    // Draw white cross
    // Vertical bar
    imagefilledrectangle($img, 12, 6, 19, 25, $white);
    // Horizontal bar  
    imagefilledrectangle($img, 6, 12, 25, 19, $white);
    
    // Save as PNG first
    imagepng($img, 'public/favicon-32x32.png');
    
    // Also create 16x16 version
    $small = imagecreate(16, 16);
    $red_small = imagecolorallocate($small, 220, 38, 38);
    $white_small = imagecolorallocate($small, 255, 255, 255);
    
    imagefill($small, 0, 0, $red_small);
    // Smaller cross
    imagefilledrectangle($small, 6, 3, 9, 12, $white_small);
    imagefilledrectangle($small, 3, 6, 12, 9, $white_small);
    
    imagepng($small, 'public/favicon-16x16.png');
    
    // Clean up
    imagedestroy($img);
    imagedestroy($small);
    
    echo "Favicon images generated successfully!\n";
    echo "You can use an online tool to convert the PNG files to ICO format.\n";
    echo "Recommended: https://favicon.io/favicon-converter/\n";
} else {
    echo "GD extension not available. Please install php-gd extension.\n";
}
?>