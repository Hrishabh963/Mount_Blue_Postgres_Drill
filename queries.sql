--Query 1 to get percentage of posts with atleast 1 answer
SELECT (COUNT(*) * 100.0 / (SELECT COUNT(*) FROM posts)) AS percentage_answered
FROM posts
WHERE answercount > 0 AND posttypeid = 1

--Query 2 to get top ten reputable users
SELECT id,reputation,displayname FROM users
ORDER BY reputation DESC
LIMIT 10;


--Which day of the week has most questions answered within an hour?
SELECT TO_CHAR(question_table.creationdate , 'day') AS weekday , COUNT(answer_table.id) AS answers_within_hour
    FROM 
    (
    SELECT posts.id ,creationdate
        FROM posts
        WHERE posts.posttypeid = 1
    ) AS question_table
    
    INNER JOIN 
    
    (
    SELECT posts.id,posts.parentid ,posts.creationdate
        FROM posts
        WHERE posts.posttypeid = 2
    ) AS answer_table
    ON question_table.id = answer_table.parentid
    WHERE (EXTRACT(EPOCH FROM (question_table.creationdate - answer_table.creationdate)) / 3600 < 1 ) AND 
    DATE(question_table.creationdate) = DATE(answer_table.creationdate)
    GROUP BY weekday
    ORDER BY answers_within_hour DESC
    LIMIT 1;

--Find the top 10 posts with the most upvotes in 2015?
SELECT id as post_id ,upvotes FROM posts
INNER JOIN (
SELECT postid,COUNT(*) as upvotes FROM VOTES
	WHERE votetypeid = 2 
	GROUP BY postid
) AS vo
ON  posts.id = vo.postid
WHERE EXTRACT(YEAR FROM posts.creationdate) = 2015
ORDER BY upvotes DESC
LIMIT 10;

--Find the top 5 tags associated with the most number of posts
SELECT tags,COUNT(*) AS tag_count
FROM POSTS
WHERE tags IS NOT NULL
GROUP BY tags
ORDER BY tag_count DESC
LIMIT 5;

--Find the number of questions asked every year
SELECT EXTRACT(YEAR FROM creationdate) AS year, count(*) as number_of_questions 
FROM posts
WHERE posttypeid = 1
GROUP BY YEAR
ORDER BY YEAR;


--For the questions asked in 2014, find any 3 "rare" questions that are associated with the least used tags
SELECT posts.id,posts.tags,posts.body
FROM posts
INNER JOIN (
SELECT tagname FROM TAGS
    ORDER BY COUNT ASC
    LIMIT 10
) AS least_used
ON posts.tags LIKE CONCAT('%',least_used.tagname,'%')
WHERE posttypeid = 1
AND EXTRACT(YEAR FROM creationdate) = 2014
LIMIT 3;

--When did arduino.stackexchange.com have the most usage
SELECT EXTRACT(YEAR FROM creationdate) as year ,  SUM(answercount+viewcount+commentcount) AS user_engagement, count(*) as posts
    FROM posts
    GROUP  BY year
    ORDER BY user_engagement DESC;


--Find the top 5 users who have performed the most number of actions 
SELECT user_table.id, SUM(total_votes + number_of_posts+comment_table.total_comments) AS points 
    FROM (
    SELECT comments.userid , COUNT(comments.id)*3 AS total_comments
        FROM comments
        GROUP BY comments.userid
    ) AS comment_table
    INNER JOIN
   (
   SELECT users.id , SUM(users.upvotes + users.downvotes) AS total_votes , COUNT(posts.owneruserid)*10 AS number_of_posts 
   FROM users
   INNER JOIN posts
   ON users.id = posts.owneruserid
   GROUP BY users.id
   ) AS user_table
   ON user_table.id = comment_table.userid
   GROUP by user_table.id
   ORDER BY points DESC
   LIMIT 5;
