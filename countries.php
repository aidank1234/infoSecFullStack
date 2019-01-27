<?php
  header('Access-Control-Allow-Origin: *');
  header("Content-Type: application/json; charset=UTF-8");
  //If the post variable value is set
  if(isset($_POST['value'])) {
    $value = $_POST['value'];
    //Make a request using the value name submitted
    $request = file_get_contents("https://restcountries.eu/rest/v2/name/" . $value);
    if($_POST['sortBy'] == 'name') {
      //Sort the countries alphabetically and limit results to 50
      $jsonArray = array_slice(json_decode($request, true), 0, 50);
      usort($jsonArray, function($a, $b) {
        return strcasecmp($a['name'], $b['name']);
      });
      $request = json_encode($jsonArray, true);
    }
    else {
      //Sort the countries by population an dlimit the results to 50
      $jsonArray = array_slice(json_decode($request, true), 0, 50);
      usort($jsonArray, function($a, $b) {
        if ($a['population']==$b['population']) return 0;
        return ($a['population']>$b['population'])?-1:1;
      });
      $request = json_encode($jsonArray, true);
    }
    echo $request;
}
  if(isset($_POST['valueCode'])) {
    //Return the country with the given code
    $valueCode = $_POST['valueCode'];
    $requestCode = file_get_contents("https://restcountries.eu/rest/v2/alpha/" . $valueCode);
    echo $requestCode;
  }
?>
