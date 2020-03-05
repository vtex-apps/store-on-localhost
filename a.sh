#!/bin/bash

for ext in '.*\.ts$' '.*\.tsx$'
do
  files=`find $1 | egrep $ext`
  for f in $files
  do
    if [ -f $f ]
    then 
      echo $f $ext
      echo "export default {} as any" > $f
    fi
  done
done

for ext in '.*\.js$' '.*\.jsx$'
do
  files=`find $1 | egrep $ext`
  for f in $files
  do
    if [ -f $f ]
    then 
      echo $f $ext
      echo "export default {}" > $f
    fi
  done
done