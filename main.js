const client = require('./postgreServer/client');
const sqlQueries = require('./sqlQueries');

const delay = () => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(), 2000);
  });
};
const main = async () => {
  try {
    // Percentage of posts with atleast one answer
    const percentage_answered = await sqlQueries.query1();
    console.log('Percentage = ', percentage_answered);

    await delay();

    //Top ten users with most reputation
    const topTenUsers = await sqlQueries.query2();
    console.log(topTenUsers);

    await delay();

    //Weekday with most questions answered within an hour
    const weekdayWithMostAnswersWithinAnHour = await sqlQueries.query3();
    console.log(weekdayWithMostAnswersWithinAnHour);

    await delay();

    //Top 10 posts with most upvotes in 2015
    const postsWithMostUpvotes = await sqlQueries.query4();
    console.log(postsWithMostUpvotes);

    await delay();

    //5 tags with most posts
    const topFiveTags = await sqlQueries.query5();
    console.log(topFiveTags);

    await delay();

    //Number of questions asked each year
    const numberOfQuestions = await sqlQueries.query6();
    console.log(numberOfQuestions);

    await delay();

    //Rare questions in year 2014
    const rareQuestions = await sqlQueries.query7();
    console.log(rareQuestions);

    await delay();

    //Most User engagement year wise
    const mostUsage = await sqlQueries.query8();
    console.log(mostUsage);

    await delay();

    //const Top 5 users based on their activity
    const topFiveUsers = await sqlQueries.query9();
    console.log(topFiveUsers);

    await client.end();
  } catch (error) {
    console.log(error);
  }
};
main();
