import type { ProductStatus } from "@/types/product";

export interface ClientProductSeed {
  name: string;
  slug: string;
  category: string;
  brand: string;
  shortDescription: string;
  description: string;
  ageRange?: { min: number; max?: number };
  status: ProductStatus;
  featured: boolean;
}

// Source: client product listing + detailed product copy supplied for this import.
// Only products with detailed source copy are included here. Missing commercial fields
// such as price, stock and SKU are intentionally not defined.
export const CLIENT_PRODUCTS: ClientProductSeed[] = [
  {
    name: "Brain Binder",
    slug: "brain-binder-activity-book-kids",
    category: "Binder",
    brand: "BuzzieWorld",
    shortDescription:
      "Make thinking time feel like playing with BuzzieWorld Brain Binder—a reusable activity binder for kids ages 4–7. Its educational challenges invite children to practise memory, thinking and focus through screen-free play. Bring it out for quiet afternoons, home-learning activities or something engaging to take on your next family trip.",
    description:
      "Give curiosity somewhere to go\n\n“What should we do now?” Meet a playful answer.\n\nBuzzieWorld Brain Binder brings reusable learning activities into everyday moments. Designed for children ages 4–7, it encourages them to pause, pay attention and think through a challenge—whether they’re exploring alongside a parent or revisiting a familiar activity.\n\nKeep it nearby for a relaxed afternoon at home, include it in your home-learning routine or pack it for time away. There’s no pressure to complete everything in one sitting. Let your child choose an activity, explore it and return whenever they’re ready.\n\nPractise memory, thinking and focus\n\nBrain Binder offers opportunities to use several thinking skills during play. Children can pay attention to information, consider their responses and stay with a small task.\n\nParents can make the experience more interactive with simple questions: “What do you notice?” “Why did you choose that?” “Would you like to try again?”\n\nThese conversations make room for curiosity and help children share how they approached an activity.\n\nPlay again at their own pace\n\nA familiar challenge can be worth another look.\n\nThe reusable format allows children to revisit activities instead of completing them only once. Introduce an activity together, then let your child take the lead as they become comfortable with the instructions.\n\nCelebrate their effort, patience and willingness to try. Those moments matter just as much as finding an answer.\n\nScreen-free activities for home and travel\n\nLooking for a physical activity to take along?\n\nBrain Binder’s travel-friendly format makes it a practical option for family visits, holidays and waiting time. At home, it can become part of a quiet-time routine or a shared parent-and-child activity.\n\nChoose one challenge for a short session or follow your child’s interest for longer play.\n\nAn educational gift they can revisit\n\nFor a child who enjoys activities and thinking challenges, Brain Binder offers something to explore beyond the unboxing moment. Its reusable format makes it a thoughtful birthday or holiday gift for children ages 4–7.",
    ageRange: { min: 4, max: 7 },
    status: "draft",
    featured: false,
  },
  {
    name: "Daily Oral Binder",
    slug: "daily-oral-binder-kids",
    category: "Binder",
    brand: "BuzzieWorld",
    shortDescription:
      "Bring a little discovery into your child’s day with the BuzzieWorld Daily Oral Binder. This Velcro-based activity binder for kids ages 3–6 introduces learning topics including planets and continents through hands-on interaction. Use it to start conversations, revisit familiar ideas and make learning together part of your everyday routine.",
    description:
      "Turn “What’s that?” into a learning moment\n\nA child’s curiosity can turn an ordinary afternoon into a conversation about the world—and beyond it.\n\nThe BuzzieWorld Daily Oral Binder gives you a starting point. Explore its activities together, introduce a topic and invite your child to tell you what they notice. Let the conversation follow their curiosity rather than rushing through every answer.\n\nExplore with their hands. Explain in their own words.\n\nThe Velcro-based format brings interaction into learning time. Follow the instructions for an activity, then invite your child to name what they recognise or explain their choice.\n\nYou can make the conversation as simple or detailed as they’re ready for. Begin with “Can you show me?” and move towards “What can you tell me about it?”\n\nMake room for everyday practice\n\nChoose one activity for a relaxed session. Revisit a familiar topic another day, ask a different question or let your child take a turn leading the conversation.\n\nFor a change of pace, swap roles: ask your child to become the teacher and explain something to you. Keep the experience playful and celebrate their willingness to participate.\n\nA gift to explore together\n\nLooking for an educational gift for a preschooler? Daily Oral Binder offers a shared activity for curious children and the adults who learn alongside them. Consider it for a birthday, a learning-themed gift or a new addition to your home activity collection.\n\nSuggested Ways to Use\n\nChoose an activity that interests your child.\n\nFollow the supplied instructions and introduce the topic.\n\nAsk a simple question and allow time for a response.\n\nInvite your child to show, name or explain their answer.\n\nReturn to familiar topics when they feel ready.\n\nProduct Details\n\nFeature\n\nDetails\n\nBrand\n\nBuzzieWorld\n\nProduct name\n\nDaily Oral Binder\n\nProduct type\n\nVelcro-based educational activity binder\n\nRecommended age\n\n3–6 years\n\nConfirmed topics\n\nPlanets and continents\n\nSuggested use\n\nParent-guided learning and preschool activities",
    ageRange: { min: 3, max: 6 },
    status: "draft",
    featured: false,
  },
  {
    name: "Match-O-Fun",
    slug: "match-o-fun-learning-game",
    category: "Binder",
    brand: "BuzzieWorld",
    shortDescription:
      "Turn matching into a playful learning adventure with BuzzieWorld Match-O-Fun. This educational activity binder brings together 105 tasks that introduce preschool learning concepts, including language and numeracy. Its interactive Velcro-based format gives children something to explore with their hands while they look, think and choose. A practical addition to home-learning routines, shared playtime and educational gifting.",
    description:
      "Make “Can you find it?” the start of something fun\n\nChildren notice all sorts of things when we give them time to look.\n\nMatch-O-Fun turns that curiosity into an interactive activity. Introduce a task, explore the choices together and invite your child to find an answer. Each attempt creates an opportunity to talk about what they noticed and how they made their decision.\n\nWith 105 activities to explore, you can choose a familiar task or try something different as your child’s interests change.\n\nBring preschool concepts into play\n\nLearning a new word or understanding an early number concept can begin with a simple conversation.\n\nUse the binder’s language and numeracy activities to introduce an idea, demonstrate an example and let your child have a turn. Keep the experience relaxed: ask questions, listen to their answers and offer a little guidance when needed.\n\nGive little hands a role in learning\n\nThe Velcro-based activities add a physical element to the experience. Children can interact with the materials while following the task instructions, giving them an active role in each challenge.\n\nInstead of immediately revealing an answer, try asking, “What do you notice?” or “What made you choose that one?”\n\nMake space for another attempt\n\nChoose one activity at a time and work at your child’s pace. If a task feels difficult, explore it together or return to it later.\n\nCelebrate careful observation, questions and willingness to try. “You looked again and noticed something new!” can make the learning moment feel rewarding.\n\nA useful addition to home learning\n\nBring Match-O-Fun into a quiet afternoon, a parent-and-child activity session or your regular preschool learning routine. Let your child choose where to begin, then use the activity as a starting point for conversation.",
    status: "draft",
    featured: false,
  },
  {
    name: "Toddler Busy Binder",
    slug: "toddler-busy-binder-learning-book",
    category: "Binder",
    brand: "BuzzieWorld",
    shortDescription:
      "Make everyday learning hands-on with the BuzzieWorld Toddler Busy Binder. This reusable activity book introduces animals, colours, shapes and vegetables through interactive matching and sorting. Its Velcro-based pieces invite little hands to explore, while the compact A5 format makes it easy to bring along for family outings. Choose a page, explore together and enjoy a little discovery—at home or on the go.",
    description:
      "Make their next discovery a hands-on one\n\nA familiar animal. A favourite colour. A shape they recognise.\n\nThe Toddler Busy Binder turns these small discoveries into opportunities to play and learn together. Invite your child to explore a page, choose a piece and find where it belongs. Start with a simple prompt, then give them time to look and respond.\n\nThere’s no need to finish every activity in one sitting. Follow their curiosity and let them return to the pages they enjoy.\n\nMatch, name and talk together\n\nUse the activities as a starting point for conversation. Name an animal, point out a colour or ask your child to show you a shape.\n\nTry prompts such as “Can you find another one?” or “What colour is this?” For younger children, demonstrate and name the objects together. As they become familiar with an activity, invite them to make more choices themselves.\n\nFavourite activities, ready for another round\n\nRepetition is part of the fun. Reset the reusable pieces and explore a familiar page again, or introduce a different theme when your child is ready.\n\nYou can also vary the conversation without changing the activity. One day, name the pictures together; another day, ask your child to find an item you describe.\n\nPack a little play for the journey\n\nKeep the binder in your outing bag for family visits, holidays, dining out or waiting time. Its compact format gives you a convenient activity to bring into those in-between moments.\n\nSet out only the pieces needed for the chosen activity and return them to storage afterwards.\n\nA thoughtful gift for early learners\n\nLooking for a useful toddler gift? The Busy Binder combines familiar learning themes with an interactive format children and caregivers can explore together. Choose it for a birthday, a holiday surprise or an addition to a home-learning collection.",
    ageRange: { min: 1, max: 4 },
    status: "draft",
    featured: false,
  },
  {
    name: "Animal Homes",
    slug: "animal-homes-learning-game-kids",
    category: "Binder",
    brand: "BuzzieWorld",
    shortDescription:
      "Turn your child’s love of animals into a playful learning adventure. BuzzieWorld Animal Homes introduces 12 animals and explores their homes, baby names and food through an educational activity binder for kids ages 2–6. Use it to start conversations, practise matching and discover connections together. A screen-free activity for curious toddlers and preschoolers.",
    description:
      "There’s a story behind every animal\n\nWhere does it live? What is its baby called? What does it eat?\n\nAnimal Homes gives you a starting point for these everyday questions. Choose an animal, explore the activity together and invite your child to share what they already know.\n\nLet their curiosity guide the conversation. You might spend a session exploring one animal or revisit several familiar favourites.\n\nLook, connect and explain\n\nMatching gives children a reason to pause and observe.\n\nIntroduce the task using the supplied instructions, then allow your child to consider an answer. Ask, “What made you choose that?” or “Can you tell me about this animal?”\n\nFor younger learners, begin by naming and pointing together. As they become more familiar with the material, invite them to explain the connections in their own words.\n\nBring animal learning into everyday life\n\nKeep the conversation going beyond the activity.\n\nWhen an animal appears in a storybook or during a family outing, ask what your child remembers. Talk about its home or the name of its young, then return to the binder to explore further.\n\nThese small conversations give familiar learning a new setting.\n\nMake learning together part of your routine\n\nBring Animal Homes into a relaxed afternoon, a home-learning session or a preschool animal theme. There’s no need to work through everything at once.\n\nChoose a manageable activity, follow your child’s interest and celebrate their questions as much as their answers.",
    ageRange: { min: 2, max: 6 },
    status: "draft",
    featured: false,
  },
  {
    name: "Math Busy Book",
    slug: "math-busy-book-kids",
    category: "Binder",
    brand: "BuzzieWorld",
    shortDescription:
      "Make early maths something your child can touch, try and enjoy. The BuzzieWorld Math Busy Book brings together 18 reusable activities for kids ages 2–5, combining Velcro matching with wipe-clean practice. Explore counting, number recognition, tracing and early addition through colourful, hands-on activities. Match, count, trace, wipe and return for another round—at home or on the go.",
    description:
      "Turn “Let’s do maths” into “Let’s have a go!”\n\nEarly maths can begin with a simple discovery: recognising a number, counting a group or noticing what comes next.\n\nBuzzieWorld Math Busy Book creates opportunities for these moments through activities children can explore with their hands. Choose a page, introduce the task and let your child take a turn. Keep the experience playful, with time to look, think and try.\n\nTwo ways to play and practise\n\nThe book combines six Velcro activities with 12 wipe-clean activities, giving children different ways to engage.\n\nUse the Velcro activities for hands-on interaction, then explore tracing and other tasks on the wipe-clean pages. Revisit a familiar activity another day or choose something different when your child is ready.\n\nFrom first numbers to new challenges\n\nBegin with counting, number recognition and tracing. As your child becomes more comfortable, introduce concepts such as missing numbers, before and after, and simple addition.\n\nThe book also includes ten frames, equal concepts, odd and even numbers, and skip counting. Explore these with adult guidance according to your child’s understanding. There’s no need to complete every activity in order or master every concept at once.\n\nMake room for another attempt\n\nA reusable page gives your child another opportunity to explore.\n\nIf an answer doesn’t work, talk it through together, reset the activity and try again. Ask questions such as “Shall we count together?” or “What do you think comes next?”\n\nCelebrate the process—careful counting, a question asked or a new approach tried—as well as the answer.\n\nA little learning for everyday moments\n\nBring the Math Busy Book into your home-learning routine, take it along for family trips or choose a page for a quiet afternoon together.\n\nIt also makes a thoughtful gift for toddlers and preschoolers: an activity book they can return to as their interests and understanding develop.\n\nMaths Concepts to Explore\n\nCounting and number recognition\n\nTen frames\n\nUnderstanding equal amounts\n\nMissing numbers\n\nNumbers before and after\n\nOdd and even numbers\n\nSkip counting\n\nEarly addition\n\nNumber tracing\n\nOther pre-maths concepts",
    ageRange: { min: 2, max: 5 },
    status: "draft",
    featured: false,
  },
  {
    name: "Buzzie Brains Activity Mats",
    slug: "buzzie-brains-reusable-activity-mats",
    category: "Mind games",
    brand: "BuzzieWorld",
    shortDescription:
      "Give curious minds a challenge with BuzzieWorld Buzzie Brains. This reusable activity kit brings together 20 logic-based exercises across 10 double-sided mats, inviting children to think, explore answers and try different approaches. Designed for kids ages 4–8, the write-and-wipe format makes room for repeat practice. Bring it out for a quiet afternoon, add it to your home-learning routine or pack it for a family trip.",
    description:
      "Make thinking time something to look forward to\n\nA good challenge gives a child something to wonder about.\n\nBuzzie Brains invites children to explore logic activities at their own pace. Choose a mat, introduce the task and give your child time to work through it. There’s no pressure to finish the entire kit in one session—start with what catches their interest.\n\nA fresh attempt is a wipe away\n\nThe write-and-wipe format makes mistakes part of the process. Your child can try an answer, discuss it with you and revisit the activity.\n\nEncourage them with questions such as “How did you work that out?” or “What else could you try?” These conversations make room for different approaches and help you understand their thinking.\n\nLet your child take the lead\n\nDemonstrate an unfamiliar activity when needed, then step back and allow an independent attempt.\n\nFor a change of pace, swap roles. Ask your child to explain the task to you or give you a clue. Celebrate patience, curiosity and the willingness to keep trying—not only correct answers.\n\nBring a little challenge into everyday play\n\nKeep Buzzie Brains nearby for after-school activities, shared family time or a relaxed weekend session. Its portable format also makes it a useful addition to your travel activity bag.\n\nPick one challenge when time is short, or explore several while your child is interested.\n\nA thoughtful gift for puzzle-loving kids\n\nLooking for an educational gift with something to do beyond the unboxing? Buzzie Brains offers reusable challenges children can return to. Choose it for birthdays, holidays or a new addition to a home-learning collection.",
    ageRange: { min: 4, max: 8 },
    status: "draft",
    featured: false,
  },
  {
    name: "Buzzie Brains Part 2",
    slug: "buzzie-brains-part-2-activity-mats",
    category: "Mind games",
    brand: "BuzzieWorld",
    shortDescription:
      "Make thinking time playful with BuzzieWorld Buzzie Brains Part 2. Designed for kids ages 3–6, this reusable activity kit features 12 challenges across six double-sided sheets, including logic puzzles and pattern activities. Children can explore an answer, wipe the surface clean and try again. With a marker and instruction sheet included, it’s a convenient screen-free activity for home learning, family time and travel.",
    description:
      "Make room for “Let me try!”\n\nA new challenge can spark a question, a different idea or a determined second attempt.\n\nBuzzie Brains Part 2 brings those moments into everyday play. Its activities invite children to explore logic puzzles and brain teasers at their own pace. Choose a sheet, introduce the task and give your child time to work through an answer.\n\nStart with an activity that feels approachable, then explore others as their interest and understanding grow.\n\nLook closely and think it through\n\nPattern activities give children a reason to notice details and consider what comes next. Other challenges invite them to approach a problem and test an idea.\n\nMake the experience conversational. Ask, “What do you notice?” or “How did you choose that answer?” Let your child explain their thinking before offering help.\n\nWipe clean. Have another go.\n\nThe reusable format makes space for practice without pressure.\n\nIf your child wants to change an answer, they can wipe the activity clean and try again. Return to a familiar task another day or let them show you how they approached it.\n\nCelebrate careful observation, persistence and curiosity alongside completed activities.\n\nBring a little thinking time anywhere\n\nKeep the kit nearby for a quiet afternoon, introduce an activity during home learning or take it along on a family holiday. Its portable sheets make it convenient to choose one challenge at a time.\n\nYou can also explore together: take turns discussing an answer or let your child explain a familiar activity to a family member.\n\nA thoughtful gift for curious children\n\nLooking for an educational gift for a child aged 3–6? Buzzie Brains Part 2 combines reusable activities with playful challenges in one kit. Choose it for birthdays, holidays or an addition to your child’s activity collection.",
    ageRange: { min: 3, max: 6 },
    status: "draft",
    featured: false,
  },
  {
    name: "Guess Who I Am?",
    slug: "guess-who-i-am-riddle-cards",
    category: "Mind games",
    brand: "BuzzieWorld",
    shortDescription:
      "Turn everyday downtime into a guessing game with BuzzieWorld Guess Who I Am? This portable pack contains 60 riddles on 30 double-sided cards for children and families to explore together. Read a riddle aloud, consider the clues and take a guess. Play one-on-one or divide into teams for a screen-free activity that gets everyone listening, thinking and talking.",
    description:
      "One little riddle can start a big conversation\n\n“I know this one!”\n\n“Wait—read that clue again!”\n\nGuess Who I Am? brings those moments to the table. Each riddle gives players something to think about, discuss and solve together. There’s room for a confident answer, an unexpected guess and the excitement of finally figuring it out.\n\nMake listening part of the fun\n\nRead a card aloud and give everyone time to consider the clues. Ask your child which detail helped them decide or why another answer might not fit.\n\nFor children who need support, repeat the riddle slowly and talk through it together. Keep the challenge enjoyable without rushing towards the answer.\n\nPlay your way\n\nChoose a few cards for a short session or settle in for a longer family game. Play cooperatively and solve the riddles together, or take turns challenging the other team.\n\nYou can also invite your child to become the reader. Explaining a clue or helping someone else reach an answer adds another way to participate.\n\nTake the fun beyond the living room\n\nKeep the deck in your family activity bag for outings and holidays. It’s a simple way to share a game without setting up a board or reaching for a screen.\n\nA gift that gets people talking\n\nLooking for an educational gift or a birthday return-gift idea? Guess Who I Am? offers a shared activity for curious children and the people they love playing with.",
    status: "draft",
    featured: false,
  },
  {
    name: "Knowledge Train Level 1",
    slug: "knowledge-train-level-1-game",
    category: "Travel Pack",
    brand: "BuzzieWorld",
    shortDescription:
      "Make everyday learning a conversation with BuzzieWorld Knowledge Train Level 1. This general knowledge card set introduces children ages 2–5 to 101 questions through interactive, screen-free play. Choose a question, explore the answer together and follow your child’s curiosity. The portable format makes it convenient for home learning, family time and discovering something new on the go.",
    description:
      "Start with a question. See where curiosity leads.\n\nYoung children have plenty of questions—and sometimes, an unexpected answer of their own.\n\nKnowledge Train Level 1 gives you a starting point for those conversations. Read a question aloud, give your child time to respond and explore the answer together. You don’t need to turn every session into a quiz. Let it become a relaxed opportunity to talk and discover.\n\nMake room for “I know!” and “Tell me more!”\n\nSome questions may feel familiar; others will introduce something new.\n\nCelebrate both experiences. Invite your child to share what they already know, then explain unfamiliar ideas in simple language. If they’re unsure, offer a gentle prompt instead of rushing to the answer.\n\nYou can return to a question another day and see what they remember.\n\nA small learning routine you can enjoy together\n\nChoose a few questions after breakfast, during a quiet afternoon or before putting the cards away for the day.\n\nFor younger children, begin with one question and a short conversation. As their interest grows, invite them to tell you more or take a turn choosing what to explore next.\n\nKeep sessions flexible and follow your child’s attention rather than aiming to finish a fixed number of questions.\n\nTake discovery on the go\n\nThe portable pack makes it easy to bring a shared activity on family visits and holidays. Pick a card during waiting time or enjoy a few questions together when you settle in for a journey.\n\nNo complicated setup—just a question and someone to explore it with.\n\nA thoughtful educational gift\n\nLooking for a gift for a toddler or preschooler? Knowledge Train Level 1 offers an activity children and caregivers can enjoy together. Choose it for birthdays, return gifts or an addition to a home-learning collection.\n\nSuggested Ways to Use\n\nPick a question: Start with something that suits your child’s understanding.\n\nRead it aloud: Keep the pace relaxed and give them time to respond.\n\nExplore the answer: Explain unfamiliar words or ideas.\n\nKeep talking: Ask a simple follow-up question when your child is interested.\n\nRevisit later: Return to familiar questions without pressure to remember everything.\n\nProduct Details\n\nFeature\n\nDetails\n\nBrand\n\nBuzzieWorld\n\nProduct name\n\nKnowledge Train Level 1\n\nProduct type\n\nGeneral knowledge question-and-answer cards\n\nRecommended age\n\n2–5 years\n\nQuestion count\n\n101 GK questions\n\nLearning focus\n\nEarly general knowledge\n\nFormat\n\nPhysical, screen-free card set\n\nSuggested use\n\nGuided learning, family conversations, travel and gifting",
    ageRange: { min: 2, max: 5 },
    status: "draft",
    featured: false,
  },
  {
    name: "Knowledge Train Level 2 – Part 1",
    slug: "knowledge-train-level-2-part-1",
    category: "Travel Pack",
    brand: "BuzzieWorld",
    shortDescription:
      "Turn everyday curiosity into quiz-time fun with BuzzieWorld Knowledge Train Level 2 – Part 1. This educational card set features 80 general knowledge questions for children ages 5–9, with topics including geography, the environment, sports and politics. Read a question, explore the answer and see where the conversation leads. A portable activity for home learning, family time and discovery on the go.",
    description:
      "Make “Did you know?” part of your day\n\nSome questions bring an immediate answer. Others open up something your child has never thought about before.\n\nKnowledge Train Level 2 – Part 1 gives you 80 opportunities to start those conversations. Choose a question, give your child thinking time and explore the answer together. Let a familiar topic become a chance to explain more, and an unfamiliar one become an invitation to discover.\n\nExplore beyond one subject\n\nA varied quiz keeps the conversation moving. Discuss a place, an environmental idea, a sporting fact or a question about public life.\n\nYou don’t need to cover every subject in one session. Follow your child’s interests and pause when a question sparks a longer discussion.\n\nLet your child become the quiz host\n\nSwap roles and invite your child to ask the questions. They can read aloud when comfortable, listen to your answer and share what they’ve learned.\n\nFor a relaxed session, solve the questions together. For a playful challenge, take turns and agree on a simple scoring system before you start.\n\nBuild a learning routine that feels manageable\n\nChoose a few questions after school, during a weekend break or while spending time together. Keep the pace friendly and allow room for “I’m not sure.”\n\nReturn to an interesting question another day. You might ask what your child remembers or encourage them to find out one more fact about the topic.\n\nBring quiz time on the journey\n\nThe portable format makes it convenient to take the cards on family visits and holidays. Enjoy a few questions during waiting time or invite everyone to join a casual quiz when you settle in.",
    ageRange: { min: 5, max: 9 },
    status: "draft",
    featured: false,
  },
  {
    name: "Knowledge Train Level 2 – Part 2",
    slug: "knowledge-train-level-2-part-2",
    category: "Travel Pack",
    brand: "BuzzieWorld",
    shortDescription:
      "Keep curiosity moving with BuzzieWorld Knowledge Train Level 2 – Part 2. This educational quiz card set features 80 general knowledge questions for children ages 5–9, exploring subjects from geography and nature to sports and the world around us. Choose a question, share an answer and discover something worth talking about. A compact learning activity for home, family quizzes and travel.",
    description:
      "Make space for the next “How?” and “Why?”\n\nAn interesting question can lead to much more than a correct answer.\n\nKnowledge Train Level 2 – Part 2 gives children something to think about and families something to discuss. Read a question aloud, listen to your child’s response and explore the answer together. When a topic catches their attention, pause and follow the conversation.\n\nExplore the world, one question at a time\n\nThe varied subjects give each session a different direction. A geography question might inspire you to open a map. A nature question could connect with something your child noticed outdoors.\n\nUse these moments to connect facts with everyday experiences. Ask, “Have you seen this before?” or “What else would you like to find out?”\n\nLet your child lead quiz time\n\nInvite your child to choose a card and become the question reader. They can challenge a parent, quiz a sibling or help someone understand an answer.\n\nFor children who need reading support, take turns reading aloud. Keep the focus on participating and discovering rather than getting everything right.\n\nBuild a routine that fits your family\n\nYou don’t need a long session to enjoy the cards. Try a few questions after school, during a weekend break or while spending time together.\n\nFor a relaxed activity, explore answers as a team. For a friendly challenge, agree on a simple scoring system and take turns. Return to memorable questions later and see what everyone recalls.\n\nA gift for children who love discovering facts\n\nKnowledge Train Level 2 – Part 2 is a thoughtful educational gift for children ages 5–9. Choose it for birthdays, return gifts or a family activity collection that’s ready to come along on your next trip.",
    ageRange: { min: 5, max: 9 },
    status: "draft",
    featured: false,
  },
  {
    name: "Knowledge Train Level 2 Combo",
    slug: "knowledge-train-level-2-combo",
    category: "Travel Pack",
    brand: "BuzzieWorld",
    shortDescription:
      "Bring more discovery into family time with the BuzzieWorld Knowledge Train Level 2 Combo. Featuring both Part 1 and Part 2, this general knowledge card set introduces children ages 5–9 to questions about geography, nations, everyday surroundings, politics, the environment, sports and nature. Read, answer and explore together. The easy-to-hold, ring-bound packs make it convenient to enjoy a few questions at home or take your next quiz on a family trip.",
    description:
      "Make the world a little more interesting, one question at a time\n\nAn unfamiliar place. A surprising fact. Something your child has noticed but never asked about.\n\nThe Knowledge Train Level 2 Combo gives you a starting point for those conversations. With Part 1 and Part 2 together, you can choose a pack, explore a question and see what catches your child’s attention.\n\nKeep it relaxed: knowing the answer is fun, but discovering something new can be just as rewarding.\n\nExplore beyond a single subject\n\nThe set covers geography, nations, surroundings, politics, the environment, sports and nature. That variety gives your child different ideas to explore without turning every session into a lesson.\n\nWhen a question sparks interest, take it further. Find a place on a map, connect a nature topic with something outdoors or talk about a sport your family enjoys.\n\nLet everyone take a turn\n\nInvite your child to become the quiz host. They can choose a question, read it aloud when comfortable and listen to everyone’s answers.\n\nFor children who need reading support, an adult can lead. Play cooperatively, take turns or create a friendly family challenge using your own scoring system.\n\nKeep learning manageable\n\nChoose a handful of questions for a short session rather than trying to work through an entire pack. Let your child’s interest guide the pace.\n\nReturn to a memorable question another day and ask what they remember. Give them space to say “I’m not sure” and explore the answer together.\n\nReady for your next family outing\n\nThe portable, ring-bound format keeps each set together and makes the cards easy to carry. Pack them for a holiday, bring them to a family gathering or keep them nearby for a quick quiz break.",
    ageRange: { min: 5, max: 9 },
    status: "draft",
    featured: false,
  },
  {
    name: "Animal World Flashcards",
    slug: "animal-world-flashcards",
    category: "Travel Pack",
    brand: "BuzzieWorld",
    shortDescription:
      "Turn your child’s love of animals into playful learning with BuzzieWorld Animal World Flashcards. Explore animal sounds, discover what young animals are called, and introduce animal groups through conversations and simple question games. A thoughtful addition to preschool learning and family activity time.",
    description:
      "Bring a little animal discovery into everyday play.\n\nBuzzieWorld Animal World Flashcards give parents and educators a starting point for conversations about animals. Explore their sounds, talk about their young ones, and introduce the names associated with animal groups.\n\nKeep the experience relaxed and playful. Invite your child to answer a question, make a sound, or tell you something they already know. Each response can lead to another question—and another chance to explore together.",
    status: "draft",
    featured: false,
  },
  {
    name: "Knowledge Train Level 3",
    slug: "knowledge-train-level-3-game",
    category: "Travel Pack",
    brand: "BuzzieWorld",
    shortDescription:
      "Bring questions, discovery, and friendly challenges into everyday learning with BuzzieWorld Knowledge Train Level 3. Designed for children aged 9 and above, these general knowledge quiz cards offer a playful starting point for learning together. Use them for family quiz time, independent practice, or conversations that go beyond the answer. Key benefits A challenge for curious learners: Level 3 GK cards for children aged 9+ who enjoy discovering and testing what they know. Make questions part of playtime: Turn a few spare minutes into a quiz, a conversation, or a shared learning activity. Practise recalling information: Revisit questions and invite children to explain their answers in their own words. Bring the family together: Take turns asking questions and let children become the quiz host. A thoughtful educational gift: A choice for young quiz enthusiasts who enjoy learning something new.",
    description:
      "“What do you think the answer is?”\n\nOne question can spark a discussion, reveal something unexpected, or inspire a child to find out more. BuzzieWorld Knowledge Train Level 3 brings that spirit of discovery to general knowledge practice.\n\nDesigned for ages 9+, this quiz card set gives children a way to explore questions at their own pace. Make it part of a relaxed learning routine or bring it out when the family is ready for a friendly challenge.\n\nTurn answers into conversations\n\nEncourage your child to share why they chose an answer. When something is unfamiliar, explore it together and return to the question another day. The goal is to make asking, thinking, and discovering enjoyable.\n\nMake the experience their own\n\nSome children enjoy keeping score. Others prefer taking their time or asking the questions themselves. Adapt the activity to their interests and keep the atmosphere encouraging.",
    ageRange: { min: 9 },
    status: "draft",
    featured: false,
  },
  {
    name: "Multiplication Table Flashcards 1–20",
    slug: "multiplication-table-flashcards-1-20",
    category: "Travel Pack",
    brand: "BuzzieWorld",
    shortDescription:
      "Make times-table practice part of everyday learning with BuzzieWorld Multiplication Table Flashcards. Covering tables from 1 to 20, these reusable learning cards give children a way to read, recall, and revisit multiplication facts. Bring them into homework time, parent-child quizzes, or classroom revision.",
    description:
      "Give multiplication practice a place in your child’s daily routine.\n\nBuzzieWorld Multiplication Table Flashcards cover tables from 1 to 20 in a reusable card format. Whether your child is getting familiar with multiplication or revisiting facts they have already learned, the cards provide a starting point for regular practice.\n\nPractise one table at a time\n\nBegin with a table your child is learning. Read through it together, then invite them to try a few answers independently. Keep the session manageable and return to tricky facts another day.\n\nTurn revision into a shared activity\n\nTake turns asking questions, let your child become the quiz host, or choose a handful of facts to practise before homework. Make room for thinking time and celebrate effort as well as correct answers.\n\nGo beyond saying the answer\n\nUse a multiplication fact as a conversation starter. Ask your child to explain it using equal groups, a drawing, or objects you already have at home. This adds another way to explore what the numbers mean.",
    status: "draft",
    featured: false,
  },
];
