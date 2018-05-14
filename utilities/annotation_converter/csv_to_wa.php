<?php
/**
 * csv_to_wa.php
 * Converts a csv file to json-encoded web annotation format
 * that is readable by Waldorf.js
 *
 * The csv file should have the following fields:
 * url, creator, creator_email, language, tags (comma delimited), start_time, stop_time, body
 * It does NOT support geometric fragments because I'm assuming those are too difficult to
 * create by hand in a csv file.
 *
 * This script takes two arguments: the source file and a destination file name
 * ex: php csv_to_wa.php -i sample_annotation_set.csv -o sample_annotation_set.json
 * @author John Bell
 * @version 1.0
 */

//Get args
$options = getopt("i:o:");

//Check files
$fin = fopen($options['i'], 'r');
$fout = fopen($options['o'], 'w');

if($fin === FALSE) exit('Could not open file: '.$options['i']);
if($fout === FALSE) exit('Could not create file: '.$options['o']);

//Begin output array
$wa = [];

//Create common annotation elements
$anno_template = array(
    'context' => 'http://www.w3.org/ns/anno.jsonld',
    'type' => 'Annotation',
    'motivation' => 'highlighting',
    'creator'=>array('type' => 'Person'),
    'body'=>array(array(
        'type' => 'TextualBody',
        'format' => 'text/plain',
        'purpose' => 'describing'
    )),
    'target' => array(
        'type' => 'Video',
        'selector' => array(array(
            'type' => 'FragmentSelector',
            'conformsTo' => 'http://www.w3.org/TR/media-frags/'
        ))
    )
);
$annotations = array();

//Loop through input csv
//Get the column headers
$headers = fgetcsv($fin);

$ct = 0;
while($row = fgetcsv($fin)){
    //Get the data
    $anno = $anno_template;
    //This should work. It doesn't. That's really weird.
    //$data = array_combine($headers, $row);
    $data = array();
    for($i=0; $i<count($row); $i++){
        $data[preg_replace('/[^\PC\s]/u', '', $headers[$i])] = $row[$i];
    }

    //Add a uid
    $anno['id'] = ++$ct;
    //Map the data into the right parts of the template
    $anno['creator']['nickname'] = $data['creator'];
    $anno['creator']['email'] = sha1($data['creator_email']);
    $anno['body'][0]['value'] = $data['body'];
    $anno['body'][0]['language'] = $data['language'];
    $anno['target']['id'] = $data['url'];
    $anno['target']['selector'][0]['value'] = 't='.$data['start_time'].','.$data['stop_time'];


    //tags are different because there may be more than one
    $tags = str_getcsv($data['tags']);
    for($i=0; $i<count($tags); $i++){
        array_push($anno['body'], array('type' => 'TextualBody', 'purpose' => 'tagging', 'value' => $tags[$i]));
    }
    array_push($annotations, $anno);
}

fwrite($fout, json_encode($annotations, JSON_PRETTY_PRINT));
fclose($fin);
fclose($fout);
?>