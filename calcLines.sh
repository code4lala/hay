cat $0
ts_len=`find -name "*.ts" -exec wc -l "{}" \; | awk '{s+=$1}END{print s}'`
vue_len=`find -name "*.vue" -exec wc -l "{}" \; | awk '{s+=$1}END{print s}'`
js_len=`find -name "*.js" -exec wc -l "{}" \; | awk '{s+=$1}END{print s}'`
echo -e "ts行数\t$ts_len"
echo -e "vue行数\t$vue_len"
echo -e "js行数\t$js_len"
sum_len=`expr $ts_len + $vue_len + $js_len`
echo -e "总行数\t$sum_len"

