#!/bin/bash
rm -rf stories/
rm -rf outslides/
mkdir stories/
mkdir outslides/

node 10_intro/generate_intro.js
node 20_covid19/generate_covid19.js
node 21_iit/generate_iit.js
node 22_codemy/generate_codemy.js 
node 23_kunjungan/generate_kunjungan.js
node 24_hmif_goes_out/generate_hmif_goes_out.js 
node 25_phishing_test/generate_fish.js 
node 26_gemastik/generate_gemastik.js
node 27_bootcamp_overview/generate_bootcamp_overview.js
node 28_bootcamp_thanks/generate_bootcamp_thanks.js
node 30_async_commitments/generate_async_comm.js
node 35_apresiasi_personal/generate_apresiasi_personal.js
node 36_apresiasi_hometour/generate_apresiasi_hometour.js
node 50_maininkamu/generate_maininkamu.js
node 60_kangenkamu/generate_kangenkamu.js
node 70_rapor_anggota/generate_rapor_anggota.js

node final/generate_final.js