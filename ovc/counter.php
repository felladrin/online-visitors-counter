<?php
require_once 'config.php';

session_start();

$_SESSION['id'] = (isset($_SESSION['id'])) ? $_SESSION['id'] : uniqid();
$secondsToConsiderOffline = (isset($secondsToConsiderOffline)) ? $secondsToConsiderOffline : 60;
$visitorSingular = (isset($visitorSingular)) ? $visitorSingular : "Visitor";
$visitorPlural = (isset($visitorPlural)) ? $visitorPlural : "Visitors";
$pageSingular = (isset($pageSingular)) ? $pageSingular : "Page";
$pagePlural = (isset($pagePlural)) ? $pagePlural : "Pages";
$linkFormat = (isset($linkFormat)) ? $linkFormat : '%1$d %2$s in %3$d %4$s';
$databaseFile = (isset($databaseFile)) ? $databaseFile : 'counter.sqlite';

try
{
    if (!file_exists($databaseFile))
    {
        $createQuery = "CREATE TABLE 'online' ('id' TEXT PRIMARY KEY NOT NULL, 'page_title' TEXT, 'page_url' TEXT, 'last_activity' INTEGER)";
    }

    $db = new PDO("sqlite:$databaseFile");

    if (isset($createQuery))
    {
        $db->query($createQuery);
    }
}
catch (PDOException $e)
{
    die($e->getMessage());
}

$currentTime = time();

$gracePeriod = $currentTime - $secondsToConsiderOffline;

$id = $_SESSION['id'];

$page_title = (isset($_REQUEST['page_title'])) ? $_REQUEST['page_title'] : '';

$page_url = (isset($_REQUEST['page_url'])) ? $_REQUEST['page_url'] : '';

$delete = $db->prepare("DELETE FROM online WHERE last_activity < :gracePeriod OR id = :id");
$delete->bindValue(':gracePeriod', $gracePeriod, PDO::PARAM_INT);
$delete->bindValue(':id', $id, PDO::PARAM_STR);
$delete->execute();

$insert = $db->prepare("INSERT INTO online (id, page_title, page_url, last_activity) VALUES (:id, :page_title, :page_url, :currentTime)");
$insert->bindValue(':id', $id, PDO::PARAM_STR);
$insert->bindValue(':page_title', $page_title, PDO::PARAM_STR);
$insert->bindValue(':page_url', $page_url, PDO::PARAM_STR);
$insert->bindValue(':currentTime', $currentTime, PDO::PARAM_INT);
$insert->execute();

$count = $db->query('SELECT COUNT() AS visitors, COUNT(DISTINCT page_url) AS pages FROM online WHERE last_activity IS NOT NULL AND id IS NOT NULL')->fetch(PDO::FETCH_ASSOC);

if ($count['visitors'] <= 1)
{
    $visitors = 1;
    $visitorWord = $visitorSingular;
}
else
{
    $visitors = $count['visitors'];
    $visitorWord = $visitorPlural;
}

if ($count['pages'] <= 1)
{
    $pages = 1;
    $pageWord = $pageSingular;
}
else
{
    $pages = $count['pages'];
    $pageWord = $pagePlural;
}

echo sprintf($linkFormat, $visitors, $visitorWord, $pages, $pageWord);
