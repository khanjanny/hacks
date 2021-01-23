#!/usr/bin/env python3
from core import requester
from core import extractor
from core import save_it
from urllib.parse import unquote 
import requests
import re
import argparse
import os
import sys
import time 
start_time = time.time()


def main():
    if os.name == 'nt':
        os.system('cls')
    parser = argparse.ArgumentParser(description='ParamSpider a parameter discovery suite')
    parser.add_argument('-d','--domain' , help = 'Domain name of the taget [ex : hackerone.com]' , required=True)
    parser.add_argument('-s' ,'--subs' , help = 'Set False for no subs [ex : --subs False ]' , default=True)
    parser.add_argument('-l','--level' ,  help = 'For nested parameters [ex : --level high]')
    parser.add_argument('-e','--exclude', help= 'extensions to exclude [ex --exclude php,aspx]')
    parser.add_argument('-o','--output' , help = 'Output file name [by default it is \'domain.txt\']')
    parser.add_argument('-p','--placeholder' , help = 'The string to add as a placeholder after the parameter name.', default = "FUZZ")
    parser.add_argument('-q', '--quiet', help='Do not print the results to the screen', action='store_true')
    args = parser.parse_args()

    if args.subs == True:
        url = f"http://web.archive.org/cdx/search/cdx?url=*.{args.domain}/*&output=txt&fl=original&collapse=urlkey&page=/"
    else:
        url = f"http://web.archive.org/cdx/search/cdx?url={args.domain}/*&output=txt&fl=original&collapse=urlkey&page=/"

    response = requester.connector(url)
    if response == False:
        return
    response = unquote(response)

    # for extensions to be excluded 
    black_list = []
    if args.exclude:
         if "," in args.exclude:
             black_list = args.exclude.split(",")
             for i in range(len(black_list)):
                 black_list[i] = "." + black_list[i]
         else:
             black_list.append("." + args.exclude)
             
    else: 
         black_list = [] # for blacklists
    if args.exclude:
        print(f"\u001b[31m[!] URLS containing these extensions will be excluded from the results   : {black_list}\u001b[0m\n")
    
    final_uris = extractor.param_extract(response , args.level , black_list, args.placeholder)
    save_it.save_func(final_uris , args.output , args.domain)

    if not args.quiet:
        print('\n'.join(final_uris))

if __name__ == "__main__":
    main()
    
