cat $0
ts_len=`find -name "*.ts" -exec wc -l "{}" \; | awk '{s+=$1}END{print s}'`
vue_len=`find -name "*.vue" -exec wc -l "{}" \; | awk '{s+=$1}END{print s}'`
js_len=`find -name "*.js" -exec wc -l "{}" \; | awk '{s+=$1}END{print s}'`
echo -e "ts����\t$ts_len"
echo -e "vue����\t$vue_len"
echo -e "js����\t$js_len"
sum_len=`expr $ts_len + $vue_len + $js_len`
echo -e "������\t$sum_len"

