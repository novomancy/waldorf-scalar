import csv, sys, getopt

def main(argv):
    try:
        opts, args = getopt.getopt(argv,"hf:u:",["file=","url="])
    except getopt.GetoptError:
        print('dvt_to_sat.py -f <filename> -u <url>')
        sys.exit(2)

    filename = ''
    url = ''
    for opt, arg in opts:
        if opt == '-h':
            print('dvt_to_sat.py -f <filename> -u <url>')
            sys.exit()
        elif opt in ("-f", "--file"):
            filename = arg
        elif opt in ("-u", "--url"):
            url = arg
    
    if(url == '' or filename == ''):
        print('missing param: dvt_to_sat.py -f <filename> -u <url>')
        sys.exit(2)        

    out = open(filename+'.json', 'w')
    out.write('[\n')
    with open(filename+'.csv', 'r') as csvfile:
        annos = csv.reader(csvfile)

        ct = 0
        for row in annos:
            ct+=1
            if(ct==1):
                continue
            # 0=cut number, 1=frame_end, 2=filename, 3=frame_start, 4=seconds_start, 5=seconds_end
            # filter out blank rows
            if(''.join(row).strip()):
                print(row)
                if(ct>2):
                    out.write(',\n')
                out.write('\t{\n')
                out.write('\t\t"body": [\n')
                out.write('\t\t\t{\n')
                out.write('\t\t\t\t"value": "Machine generated cut",\n')
                out.write('\t\t\t\t"purpose": "describing",\n')
                out.write('\t\t\t\t"language": "en",\n')
                out.write('\t\t\t\t"format": "text/plain"\n')
                out.write('\t\t\t},\n')
                out.write('\t\t\t{\n')
                out.write('\t\t\t\t"type": "TextualBody",\n')
                out.write('\t\t\t\t"purpose": "tagging",\n')
                out.write('\t\t\t\t"value": "DVT"\n')
                out.write('\t\t\t}\n')
                out.write('\t\t],\n')
                out.write('\t\t"motivation": "highlighting",\n')
                out.write('\t\t"target": {\n')
                out.write('\t\t\t"type": "Video",\n')
                out.write('\t\t\t"id": "'+url+'",\n')
                out.write('\t\t\t"selector": [\n')
                out.write('\t\t\t\t{\n')
                out.write('\t\t\t\t\t"conformsTo": "http://www.w3.org/TR/media-frags/",\n')
                out.write('\t\t\t\t\t"type": "FragmentSelector",\n')
                out.write('\t\t\t\t\t"value": "t='+row[4]+','+row[5]+'"\n')
                out.write('\t\t\t\t}\n')
                out.write('\t\t\t]\n')
                out.write('\t\t},\n')
                out.write('\t\t"creator": {\n')
                out.write('\t\t\t"type": "Software",\n')
                out.write('\t\t\t"nickname": "DVT",\n')
                out.write('\t\t\t"email": "70b9fb119f20efaeb9bbbbd459d7bc8a"\n')
                out.write('\t\t},\n')
                out.write('\t\t"@context": "http://www.w3.org/ns/anno.jsonld",\n')
                out.write('\t\t"type": "Annotation"\n')
                out.write('\t}')
    out.write('\n]')

if __name__ == "__main__":
    main(sys.argv[1:])