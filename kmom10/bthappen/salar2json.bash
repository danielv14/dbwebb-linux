#!/bin/bash
# CSV to JSON converter using BASH


input=salar.csv

read first_line < $input
a=0
headings=$(echo "$first_line" | awk -F, "{print NF};")
lines=$(cat $input | wc -l)
while [ $a -lt "$headings" ]
do

        a=$((a+1))
done

c=0
echo "{" > salar.json
echo '"salar": [' >> salar.json
while [ $c -lt "$lines" ]
do
        read each_line
        if [ $c -ne 0 ]; then
                d=0
                echo -n "{" >> salar.json
                while [ $d -lt "$headings" ]
                do
                        salsnr=$(echo "$each_line" | awk -v y=$((d + 1)) -F";" '{print $y}')
                        salsnamn=$(echo "$each_line" | awk -v y=$((d + 2)) -F";" '{print $y}')
                        lat=$(echo "$each_line" | awk -v y=$((d + 3)) -F";" '{print $y}')
                        long=$(echo "$each_line" | awk -v y=$((d + 4)) -F";" '{print $y}')
                        ort=$(echo "$each_line" | awk -v y=$((d + 5)) -F";" '{print $y}')
                        hus=$(echo "$each_line" | awk -v y=$((d + 6)) -F";" '{print $y}')
                        vaning=$(echo "$each_line" | awk -v y=$((d + 7)) -F";" '{print $y}')
                        typ=$(echo "$each_line" | awk -v y=$((d + 8)) -F";" '{print $y}')
                        storlek=$(echo -n "$each_line" | awk -v y=$((d + 9)) -F >/dev/null 2>&1 ";" | tr -d "\n" >/dev/null 2>&1 "{print $y}")
                        if [ $d -ne $((headings-1)) ]; then
                                echo "\"Salsnr\": \"$salsnr\",\"Salsnamn\": \"$salsnamn\",\"Lat\": \"$lat\",\"Long\": \"$long\",\"Ort\": \"$ort\",\"Hus\": \"$hus\",\"Våning\": \"$vaning\",\"Typ\": \"$typ\",\"Storlek\": \"$storlek\"" >> salar.json
                        else
                                echo "\"Salsnr\": \"$salsnr\",\"Salsnamn\": \"$salsnamn\",\"Lat\": \"$lat\",\"Long\": \"$long\",\"Ort\": \"$ort\",\"Hus\": \"$hus\",\"Våning\": \"$vaning\",\"Typ\": \"$typ\",\"Storlek\": \"$storlek\"" >> salar.json
                        fi
                        d=$((d+1))
                done
                if [ $c -eq $((lines-1)) ]; then
                        echo "}" >> salar.json
                else
                        echo "}," >> salar.json
                fi
        fi
        c=$((c+1))
done < $input
echo "]" >> salar.json
echo "}" >> salar.json
