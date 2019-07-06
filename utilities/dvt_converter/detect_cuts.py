import os, sys, getopt, logging

from dvt.annotate.core import FrameProcessor, FrameInput

from dvt.annotate.diff import DiffAnnotator
from dvt.annotate.face import FaceAnnotator, FaceDetectDlib, FaceEmbedVgg2
from dvt.annotate.meta import MetaAnnotator
from dvt.annotate.png import PngAnnotator
from dvt.aggregate.cut import CutAggregator
 
def main(argv):
    try:
        opts, args = getopt.getopt(argv,"hf:q:c:h:",["file=","quantiles=","cutvals=","histdiff="])

    except getopt.GetoptError:
        print('dvt_to_sat.py -f <filename> -q <quantiles> -c <cutvals> -h <histdiff>')
        sys.exit(2)

    filename = ''
    quantiles = 40
    cutvals = 3
    histdiff = 0

    for opt, arg in opts:
        if opt == '-h':
            print('dvt_to_sat.py -f <filename> -q <quantiles> -c <cutvals> -h <histdiff>')
            sys.exit()
        elif opt in ("-f", "--file"):
            filename = arg
        elif opt in ("-q", "--quantiles"):
            quantiles = arg
        elif opt in ("-c", "--cutvals"):
            cutvals = arg
        elif opt in ("-h", "--histdiff"):
            cutvals = arg            

    if(filename == ''):
        print('missing param: filename is required')
        sys.exit(2)

    basename = os.path.basename(filename)

    logging.basicConfig(level='INFO')
    finput = FrameInput(filename, bsize=128)
    fpobj = FrameProcessor()
    fpobj.load_annotator(MetaAnnotator())
    fpobj.load_annotator(DiffAnnotator(quantiles=[quantiles]))
    fpobj.process(finput)
    #fpobj.process(finput, max_batch=5)

    obj = fpobj.collect_all()
    meta = obj['meta'].todf()
    obj['diff'].todf().head()

    cagg = CutAggregator(cut_vals={'h40': histdiff, 'q'+str(quantiles): cutvals})
    fps = meta['fps'][0]
    print(fps)
    df1 = cagg.aggregate(obj).todf()
    df1['seconds_start'] = df1['frame_start'] / fps
    df1['seconds_end'] = df1['frame_end'] / fps

    out = df1.to_csv()

    f = open(basename+".csv","w")
    f.write(out)
    f.close()


if __name__ == "__main__":
    main(sys.argv[1:])