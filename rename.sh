find . -type f -name '*%2F*' | while read FILE ; do
    newfile="$(echo ${FILE} | sed -e 's/%2F/-/g;s/%40/-/g;')" ;
    mv "${FILE}" "${newfile}" ;
done 