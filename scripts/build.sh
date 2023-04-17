echo "Application is being built..."
npm run build
echo "Copying index.html to ./dist..."
cp index.html ./dist
echo "Copying styles.css to ./dist..."
cp src/css/* ./dist


cd dist
sed -i.back 's/\/dist//g' index.html
sed -i.back 's/.\/src\/css\///g' index.html