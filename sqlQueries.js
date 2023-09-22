const getQueryResult = require('./postgreServer/query');

const query1 = async() => {
    const percentage_answered = await getQueryResult(`
  SELECT (COUNT(questions.posttypeid)*100.0 / (SELECT COUNT(*) FROM POSTS WHERE posttypeid = 1)) as percentage 
  FROM (
    SELECT answercount,posttypeid FROM POSTS
  WHERE answercount > 0 AND posttypeid = 1
  ) AS questions`);
    return Number(percentage_answered[0].percentage_answered).toFixed(3);
};

const query2 = async() => {
    const topTepUsers =
        await getQueryResult(`SELECT id,reputation,displayname FROM users
    ORDER BY reputation DESC
    LIMIT 10;`);
    return topTepUsers;
};

const query3 = async() => {
    const weekdayWithMostAnswersWithinAnHour =
        await getQueryResult(`SELECT TO_CHAR(question_table.creationdate , 'day') AS weekday , COUNT(answer_table.id) AS answers_within_hour
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
    LIMIT 1;`);
    return weekdayWithMostAnswersWithinAnHour;
};

const query4 = async() => {
    const topMostUpvotedPostsIn2015 = await getQueryResult(`
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
        `);
    return topMostUpvotedPostsIn2015;
};

const query5 = async() => {
    const mostUsedTags = await getQueryResult(`SELECT tags,COUNT(*) AS tag_count
FROM POSTS
WHERE tags IS NOT NULL
GROUP BY tags
ORDER BY tag_count DESC
LIMIT 5;`);
    return mostUsedTags;
};

const query6 = async() => {
    const questionsAskedPerYear = await getQueryResult(
        `SELECT EXTRACT(YEAR FROM creationdate) AS year, count(*) as number_of_questions 
        FROM posts
        WHERE posttypeid = 1
        GROUP BY YEAR
        ORDER BY YEAR;`,
    );
    return questionsAskedPerYear;
};
const query7 = async() => {
    const rareQuestions =
        await getQueryResult(`SELECT posts.id,posts.tags,posts.body
    FROM posts
    INNER JOIN (
    SELECT tagname FROM TAGS
        ORDER BY COUNT ASC
        LIMIT 10
    ) AS least_used
    ON posts.tags LIKE CONCAT('%',least_used.tagname,'%')
    WHERE posttypeid = 1
    AND EXTRACT(YEAR FROM creationdate) = 2014
    LIMIT 3;`);
    return rareQuestions;
};
const query8 = async() => {
    const engagement =
        await getQueryResult(`SELECT EXTRACT(YEAR FROM creationdate) as year ,  SUM(answercount+viewcount+commentcount) AS user_engagement, count(*) as posts
    FROM posts
    GROUP  BY year
    ORDER BY user_engagement DESC;
    `);
    return engagement;
};

const query9 = async() => {
    const topUsers = await getQueryResult(`
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
   ) as user_table
   ON user_table.id = comment_table.userid
   GROUP by user_table.id
   ORDER BY points DESC
   LIMIT 5;`);
    return topUsers;
};
module.exports = {
    query1,
    query2,
    query3,
    query4,
    query5,
    query6,
    query7,
    query8,
    query9,
};