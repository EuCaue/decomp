#!/bin/bash

# Supported archive formats
formats=("tar.bz2" "tb2" "tbz" "tbz2" "tz2" "tar.gz" "tgz" "taz" "tlz" "tar.lz" "tar.lzma" "tar.lzo" "tar.xz" "txz" "tar.Z" "tZ" "taZ" "tar.zst" "zip" "7z" "rar")
DEST_FOLDER="./test_archive"


echo """

 ######  ########  ########    ###    ######## #### ##    ##  ######   
##    ## ##     ## ##         ## ##      ##     ##  ###   ## ##    ##  
##       ##     ## ##        ##   ##     ##     ##  ####  ## ##        
##       ########  ######   ##     ##    ##     ##  ## ## ## ##   #### 
##       ##   ##   ##       #########    ##     ##  ##  #### ##    ##  
##    ## ##    ##  ##       ##     ##    ##     ##  ##   ### ##    ##  
 ######  ##     ## ######## ##     ##    ##    #### ##    ##  ######   

   ###    ########   ######  ##     ## #### ##     ## ########  ######  
  ## ##   ##     ## ##    ## ##     ##  ##  ##     ## ##       ##    ## 
 ##   ##  ##     ## ##       ##     ##  ##  ##     ## ##       ##       
##     ## ########  ##       #########  ##  ##     ## ######    ######  
######### ##   ##   ##       ##     ##  ##   ##   ##  ##             ## 
##     ## ##    ##  ##    ## ##     ##  ##    ## ##   ##       ##    ## 
##     ## ##     ##  ######  ##     ## ####    ###    ########  ######  
"""

mkdir -p "$DEST_FOLDER"

cd "$DEST_FOLDER"

# main loop
for format in "${formats[@]}"; do
    if [[ "$format" == "zip" ]]; then
        dest_name="Archive{zip}.zip"
    elif [[ "$format" == "7z" ]]; then
        dest_name="Archive{7z}.7z"
    else
        dest_name="Archive{$format}.$format"
    fi
    
    echo "$dest_name"
    demo_file="Demo for $format.txt"
    echo "$demo_file"
    echo "You managed to successfully extract a $format!" > "$demo_file"
    
    case "$format" in
        "rar")
            rar a "$dest_name" "$demo_file" > /dev/null
            ;;
        "zip")
            zip -qj "$dest_name" "$demo_file"
            ;;
        "7z")
            7z a "$dest_name" "$demo_file" > /dev/null
            ;;
        "tar.bz2"|"tb2"|"tbz"|"tbz2"|"tz2")
            tar -cjf "$dest_name" "$demo_file"
            ;;
        "tar.gz"|"tgz"|"taz")
            tar -czf "$dest_name" "$demo_file"
            ;;
        "tar.lz")
            tar --lzip -cf "$dest_name" "$demo_file"
            ;;
        "tar.lzma"|"tlz")
            tar --lzma -cf "$dest_name" "$demo_file"
            ;;
        "tar.lzo")
            tar --lzop -cf "$dest_name" "$demo_file"
            ;;
        "tar.xz"|"txz")
            tar -cJf "$dest_name" "$demo_file"
            ;;
        "tar.Z"|"tZ"|"taZ")
            tar -cZf "$dest_name" "$demo_file"
            ;;
        "tar.zst")
            tar --zstd -cf "$dest_name" "$demo_file"
            ;;
        *)
            echo "$format not supported! Skpping..."
            ;;
    esac
    
    rm "$demo_file"
    echo "Archive created: $format"
done

cd ../
echo "Done!\n"
