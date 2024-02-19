#!/usr/bin/env bash

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

cd "$DEST_FOLDER" || exit

check_bin() {
	if ! command -v "$1" >/dev/null 2>&1; then
		echo "$1 not found in path! Skipping generate $1 archive."
		return 1
	elif [[ -n "$2" ]]; then
		eval "$2" >/dev/null 2>&1
		return 0
	fi
}

# main loop
for format in "${formats[@]}"; do
	dest_name="Archive{$format}.$format"

	echo "$dest_name" >/dev/null 2>&1
	demo_file="Demo for $format.txt"
	echo "$demo_file" >/dev/null 2>&1
	echo "You managed to successfully extract a $format!" >"$demo_file"

	#  TODO: check if the binary it's available on the path.
	case "$format" in
	"rar")
		check_bin "rar" "rar a \"$dest_name\" \"$demo_file\""
		;;
	"zip")
		check_bin "zip" "zip -qj \"$dest_name\" \"$demo_file\""
		;;
	"7z")
		check_bin "7z" "7z a \"$dest_name\" \"$demo_file\""
		;;
	"tar.bz2" | "tb2" | "tbz" | "tbz2" | "tz2")
		(check_bin "bzip2" && check_bin "tar" "tar -cjf \"$dest_name\" \"$demo_file\"") || continue
		;;
	"tar.gz" | "tgz" | "taz")
		check_bin "tar" "tar -czf \"$dest_name\" \"$demo_file\""
		;;
	"tar.lz")
		(check_bin "lzip" && check_bin "tar" "tar --lzip -cf \"$dest_name\" \"$demo_file\"") || continue
		;;
	"tar.lzma" | "tlz")
		(check_bin "lzma" && check_bin "tar" "tar --lzma -cf \"$dest_name\" \"$demo_file\"") || continue
		;;
	"tar.lzo")
		(check_bin "lzop" && check_bin "tar" "tar --lzop -cf \"$dest_name\" \"$demo_file\"") || continue
		;;
	"tar.xz" | "txz")
		tar -cJf "$dest_name" "$demo_file"
		;;
	"tar.Z" | "tZ" | "taZ")
		tar -cZf "$dest_name" "$demo_file"
		;;
	"tar.zst")
		(check_bin "zstd" && check_bin "tar" "tar --zstd -cf \"$dest_name\" \"$demo_file\"") || continue
		;;
	*)
		echo "$format not supported! Skpping..."
		;;
	esac
	echo "Archive created: $format"
done

rm ./*.txt &&
	cd ../
printf "Done!\n"
