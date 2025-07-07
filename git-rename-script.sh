#!/bin/bash

git filter-branch --env-filter '
if [ "$GIT_AUTHOR_EMAIL" != "josiel.gp@email.com" ]
then
    export GIT_AUTHOR_NAME="Josiel Galvao Pinheiro"
    export GIT_AUTHOR_EMAIL="josiel.gp@email.com"
fi
if [ "$GIT_COMMITTER_EMAIL" != "josiel.gp@email.com" ]
then
    export GIT_COMMITTER_NAME="Josiel Galvao Pinheiro"
    export GIT_COMMITTER_EMAIL="josiel.gp@email.com"
fi
' --tag-name-filter cat -- --all
