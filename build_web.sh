cd web
rm -rf *
git clone https://github.com/asymptote-inc/jury-web.git
cd jury-web
npm install
npm run build
mv build/* ../
cd ..
rm -rf jury-web
