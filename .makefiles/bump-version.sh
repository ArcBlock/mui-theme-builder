#!/usr/bin/env bash

NOW="$(LC_ALL=en_US.UTF-8 date +'%B %d, %Y')"
# RED="\033[1;31m"
# GREEN="\033[0;32m"
# YELLOW="\033[1;33m"
# BLUE="\033[1;34m"
# PURPLE="\033[1;35m"
# CYAN="\033[1;36m"
# WHITE="\033[1;37m"
# RESET="\033[0m"

LATEST_HASH=$(git log --pretty=format:'%h' -n 1)

# QUESTION_FLAG="${GREEN}?"
# WARNING_FLAG="${YELLOW}!"
# NOTICE_FLAG="${CYAN}❯"

VERSION=version

ADJUSTMENTS_MSG="${QUESTION_FLAG} ${CYAN}Now you can make adjustments to ${WHITE}CHANGELOG.md${CYAN} Then press enter to continue."

if [ -f $VERSION ]; then
    BASE_STRING=$(cat $VERSION)
    BASE_LIST=($(echo $BASE_STRING | tr '.' ' '))
    V_MAJOR=${BASE_LIST[0]}
    V_MINOR=${BASE_LIST[1]}
    V_PATCH=${BASE_LIST[2]}
    echo -e "${NOTICE_FLAG} Current version: ${WHITE}$BASE_STRING"
    echo -e "${NOTICE_FLAG} Latest commit hash: ${WHITE}$LATEST_HASH"
    V_PATCH=$((V_PATCH + 1))
    SUGGESTED_VERSION="$V_MAJOR.$V_MINOR.$V_PATCH"
    echo -ne "${QUESTION_FLAG} ${CYAN}Enter a version number [${WHITE}$SUGGESTED_VERSION${CYAN}]: "
    read INPUT_STRING
    if [ "$INPUT_STRING" = "" ]; then
        INPUT_STRING=$SUGGESTED_VERSION
    fi
    echo -e "${NOTICE_FLAG} Will set new version to be ${WHITE}$INPUT_STRING"
    echo $INPUT_STRING >$VERSION

    echo -e "## $INPUT_STRING ($NOW)\n" >tmpfile
    git log --pretty=format:"- %s" "v$BASE_STRING"...HEAD >>tmpfile
    echo "" >>tmpfile
    echo "" >>tmpfile
    cat CHANGELOG.md >>tmpfile
    mv tmpfile CHANGELOG.md
    echo -e "$ADJUSTMENTS_MSG"
    read
    git add CHANGELOG.md $VERSION
    # 新增代码：升级所有 workspaces 的 package 版本
    for package in $(ls packages/*/package.json apps/*/package.json); do
        jq --arg new_version "$INPUT_STRING" '.version = $new_version' "$package" >tmp.json && mv tmp.json "$package"
        echo "Updated version in $package to $INPUT_STRING"
    done
fi
