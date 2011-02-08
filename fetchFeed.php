<?php
  header('Content-type: text/xml');

  // You can filter the account variable
  $feed_url = 'http://www.plurk.com/user/'.$_GET['account'].'.xml';
  echo file_get_contents($feed_url);
?>
