<?php
require_once 'config.php';

echo "<h3>$visitorsPageTitle</h3>";

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
    echo $e->getMessage();
}

$result = $db->query('SELECT page_title, page_url, COUNT(page_url) AS count FROM online GROUP BY page_url ORDER BY count DESC');

if ($result)
{
    $result = $result->fetchAll(PDO::FETCH_ASSOC);

    foreach ($result as $page)
    {
        if (empty($page['page_title']))
        {
            $page['page_title'] = $unknownPages;
        }

        echo "<p><b>$page[count]</b><a href='$page[page_url]' target='_top'>$page[page_title]</a></p>";
    }
}
?>