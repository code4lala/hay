find -name "*.ts" -exec wc -l "{}" \; | awk '{s+=$1}END{print s}'
find -name "*.vue" -exec wc -l "{}" \; | awk '{s+=$1}END{print s}'
find -name "*.js" -exec wc -l "{}" \; | awk '{s+=$1}END{print s}'
