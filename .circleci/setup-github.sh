git config user.name "springunicorn"
git config user.email "38194197+springunicorn@users.noreply.github.com"

git checkout master
git pull origin master

find . -maxdepth 1 ! -name '_site' ! -name '.git' ! -name '.gitignore' -exec rm -rf {} \;
mv _site/* .
rm -R _site/

git add -fA
git commit --allow-empty -m "$(git log develop -1 --pretty=%B)"
git push origin master

echo "deployed successfully"