#!/bin/sh
./download.sh
g++ -std=c++11 gen_freq_table.cpp -o gen_freq_table.o -O3
