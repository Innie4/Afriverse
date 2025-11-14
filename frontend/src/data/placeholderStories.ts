// Placeholder stories with full content for when API fails
export interface PlaceholderStory {
  tokenId: number
  title: string
  author: string
  tribe: string
  language: string
  description: string
  image: string
  category: string
  createdAt: string
  metadata: {
    name: string
    summary: string
    expressionType: string
    chapters: Array<{
      id: string
      title: string
      contentMarkdown: string
      contentHtml: string
      contentText: string
    }>
    tags: string[]
    attributes: Array<{ trait_type: string; value: string }>
  }
}

export const placeholderStories: PlaceholderStory[] = [
  {
    tokenId: 1001,
    title: "The Legend of Anansi",
    author: "0xKwame1234567890abcdef",
    tribe: "Folklore",
    language: "English",
    description: "A timeless tale of the clever spider Anansi and his adventures across the African continent.",
    image: "/african-spider-folklore-art.jpg",
    category: "Folklore",
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    metadata: {
      name: "The Legend of Anansi",
      summary: "In the heart of West Africa, where the baobab trees stretch toward the sky and the drums echo through the villages, there lived a spider unlike any other. Anansi, the trickster, was known throughout the land for his wit, wisdom, and his uncanny ability to turn the most dire situations into opportunities.",
      expressionType: "Folklore",
      tags: ["Anansi", "Spider", "Trickster", "West Africa", "Wisdom"],
      attributes: [
        { trait_type: "Expression Type", value: "Folklore" },
        { trait_type: "Region", value: "West Africa" },
        { trait_type: "Tags", value: "Anansi,Spider,Trickster,West Africa,Wisdom" }
      ],
      chapters: [
        {
          id: "ch1",
          title: "Chapter 1: The Beginning",
          contentMarkdown: `# The Beginning

Long ago, when the world was still young and the gods walked among mortals, there lived a spider named Anansi. He was not an ordinary spider, for he possessed a gift that set him apart from all other creatures—the gift of wisdom and cunning.

Anansi made his home in a small village nestled between rolling hills and flowing rivers. The villagers knew him well, for he was always ready with a story, a joke, or a clever solution to their problems. His eight legs moved with purpose, and his eyes sparkled with mischief and intelligence.

One morning, as the sun painted the sky in shades of orange and gold, Anansi set out on a journey. He had heard whispers of a great challenge that awaited him in the kingdom of the Sky God, Nyame. The challenge was said to be impossible, but Anansi, with his boundless confidence, believed he could succeed where others had failed.

As he traveled through the forest, the trees seemed to whisper encouragement, and the animals he passed nodded in respect. Anansi's reputation preceded him, and all knew that when Anansi took on a challenge, the impossible became possible.`,
          contentHtml: `<h1>The Beginning</h1>
<p>Long ago, when the world was still young and the gods walked among mortals, there lived a spider named Anansi. He was not an ordinary spider, for he possessed a gift that set him apart from all other creatures—the gift of wisdom and cunning.</p>
<p>Anansi made his home in a small village nestled between rolling hills and flowing rivers. The villagers knew him well, for he was always ready with a story, a joke, or a clever solution to their problems. His eight legs moved with purpose, and his eyes sparkled with mischief and intelligence.</p>
<p>One morning, as the sun painted the sky in shades of orange and gold, Anansi set out on a journey. He had heard whispers of a great challenge that awaited him in the kingdom of the Sky God, Nyame. The challenge was said to be impossible, but Anansi, with his boundless confidence, believed he could succeed where others had failed.</p>
<p>As he traveled through the forest, the trees seemed to whisper encouragement, and the animals he passed nodded in respect. Anansi's reputation preceded him, and all knew that when Anansi took on a challenge, the impossible became possible.</p>`,
          contentText: "Long ago, when the world was still young and the gods walked among mortals, there lived a spider named Anansi. He was not an ordinary spider, for he possessed a gift that set him apart from all other creatures—the gift of wisdom and cunning. Anansi made his home in a small village nestled between rolling hills and flowing rivers. The villagers knew him well, for he was always ready with a story, a joke, or a clever solution to their problems. His eight legs moved with purpose, and his eyes sparkled with mischief and intelligence. One morning, as the sun painted the sky in shades of orange and gold, Anansi set out on a journey. He had heard whispers of a great challenge that awaited him in the kingdom of the Sky God, Nyame. The challenge was said to be impossible, but Anansi, with his boundless confidence, believed he could succeed where others had failed. As he traveled through the forest, the trees seemed to whisper encouragement, and the animals he passed nodded in respect. Anansi's reputation preceded him, and all knew that when Anansi took on a challenge, the impossible became possible."
        },
        {
          id: "ch2",
          title: "Chapter 2: The Challenge",
          contentMarkdown: `# The Challenge

When Anansi reached the palace of Nyame, the Sky God, he found himself standing before a magnificent structure that seemed to touch the clouds themselves. The walls shimmered with starlight, and the gates were guarded by spirits of the wind.

Nyame, a being of immense power and wisdom, sat upon a throne made of thunder and lightning. His voice boomed like distant storms as he spoke to Anansi.

"Little spider," Nyame said, his eyes twinkling with amusement, "you seek to prove your worth. I have a challenge for you, one that no creature has ever completed. If you succeed, you will gain the greatest treasure in all the land—the Box of Stories, which contains all the tales ever told and all the wisdom of the ages."

Anansi's heart raced with excitement. The Box of Stories! It was said that whoever possessed it would become the greatest storyteller in the world, able to weave tales that could move mountains and change hearts.

"What is this challenge, great Nyame?" Anansi asked, his voice steady despite his excitement.

"You must bring me four creatures," Nyame declared. "The Python of the Deep Forest, the Hornet of the Swamp, the Fairy of the Moonlight, and the Leopard of the Night. Each is more dangerous than the last, and each will test your cunning in ways you cannot imagine."`,
          contentHtml: `<h1>The Challenge</h1>
<p>When Anansi reached the palace of Nyame, the Sky God, he found himself standing before a magnificent structure that seemed to touch the clouds themselves. The walls shimmered with starlight, and the gates were guarded by spirits of the wind.</p>
<p>Nyame, a being of immense power and wisdom, sat upon a throne made of thunder and lightning. His voice boomed like distant storms as he spoke to Anansi.</p>
<p>"Little spider," Nyame said, his eyes twinkling with amusement, "you seek to prove your worth. I have a challenge for you, one that no creature has ever completed. If you succeed, you will gain the greatest treasure in all the land—the Box of Stories, which contains all the tales ever told and all the wisdom of the ages."</p>
<p>Anansi's heart raced with excitement. The Box of Stories! It was said that whoever possessed it would become the greatest storyteller in the world, able to weave tales that could move mountains and change hearts.</p>
<p>"What is this challenge, great Nyame?" Anansi asked, his voice steady despite his excitement.</p>
<p>"You must bring me four creatures," Nyame declared. "The Python of the Deep Forest, the Hornet of the Swamp, the Fairy of the Moonlight, and the Leopard of the Night. Each is more dangerous than the last, and each will test your cunning in ways you cannot imagine."</p>`,
          contentText: "When Anansi reached the palace of Nyame, the Sky God, he found himself standing before a magnificent structure that seemed to touch the clouds themselves. The walls shimmered with starlight, and the gates were guarded by spirits of the wind. Nyame, a being of immense power and wisdom, sat upon a throne made of thunder and lightning. His voice boomed like distant storms as he spoke to Anansi. Little spider, Nyame said, his eyes twinkling with amusement, you seek to prove your worth. I have a challenge for you, one that no creature has ever completed. If you succeed, you will gain the greatest treasure in all the land—the Box of Stories, which contains all the tales ever told and all the wisdom of the ages. Anansi's heart raced with excitement. The Box of Stories! It was said that whoever possessed it would become the greatest storyteller in the world, able to weave tales that could move mountains and change hearts. What is this challenge, great Nyame? Anansi asked, his voice steady despite his excitement. You must bring me four creatures, Nyame declared. The Python of the Deep Forest, the Hornet of the Swamp, the Fairy of the Moonlight, and the Leopard of the Night. Each is more dangerous than the last, and each will test your cunning in ways you cannot imagine."
        },
        {
          id: "ch3",
          title: "Chapter 3: The Victory",
          contentMarkdown: `# The Victory

Anansi did not hesitate. With a bow to Nyame, he set off on his quest, his mind already working on plans to capture each of the four creatures. He knew that brute force would not work—these were beings of great power. Only cunning and wisdom would serve him now.

First, he found the Python of the Deep Forest, a serpent so large that it could wrap around an entire tree. Anansi approached with respect and spoke to the Python with honeyed words, convincing it that he had discovered a way to measure its true length. The Python, curious and proud, agreed to stretch out along a branch while Anansi tied it with a rope, claiming he needed to measure it properly. Once the Python was secured, Anansi had captured his first prize.

Next came the Hornet of the Swamp, a creature whose sting could paralyze even the strongest warrior. Anansi crafted a small gourd and filled it with water, then approached the Hornet's nest. He called out, claiming that a great storm was coming and that the Hornet should seek shelter in his gourd. The Hornet, seeing the wisdom in this, flew inside, and Anansi quickly sealed the opening.

The Fairy of the Moonlight was trickier, for fairies are creatures of magic and cannot be caught by ordinary means. Anansi waited until the full moon, when the Fairy would be at her most powerful, and he began to tell her a story so captivating that she forgot to be cautious. As she leaned closer to hear the tale, Anansi captured her in a net woven from moonbeams and spider silk.

Finally, the Leopard of the Night, the most dangerous of all. Anansi knew that the Leopard was proud and loved to show off its strength. He challenged the Leopard to a contest of strength, claiming he could tie the Leopard to a tree. The Leopard, confident in its power, agreed. Anansi tied the Leopard securely, and the creature, realizing it had been tricked, could only roar in frustration.

With all four creatures captured, Anansi returned to Nyame's palace. The Sky God, impressed by Anansi's cleverness, presented him with the Box of Stories. From that day forward, Anansi became the keeper of all stories, sharing them with the world and teaching that wisdom and cunning can overcome even the greatest challenges.`,
          contentHtml: `<h1>The Victory</h1>
<p>Anansi did not hesitate. With a bow to Nyame, he set off on his quest, his mind already working on plans to capture each of the four creatures. He knew that brute force would not work—these were beings of great power. Only cunning and wisdom would serve him now.</p>
<p>First, he found the Python of the Deep Forest, a serpent so large that it could wrap around an entire tree. Anansi approached with respect and spoke to the Python with honeyed words, convincing it that he had discovered a way to measure its true length. The Python, curious and proud, agreed to stretch out along a branch while Anansi tied it with a rope, claiming he needed to measure it properly. Once the Python was secured, Anansi had captured his first prize.</p>
<p>Next came the Hornet of the Swamp, a creature whose sting could paralyze even the strongest warrior. Anansi crafted a small gourd and filled it with water, then approached the Hornet's nest. He called out, claiming that a great storm was coming and that the Hornet should seek shelter in his gourd. The Hornet, seeing the wisdom in this, flew inside, and Anansi quickly sealed the opening.</p>
<p>The Fairy of the Moonlight was trickier, for fairies are creatures of magic and cannot be caught by ordinary means. Anansi waited until the full moon, when the Fairy would be at her most powerful, and he began to tell her a story so captivating that she forgot to be cautious. As she leaned closer to hear the tale, Anansi captured her in a net woven from moonbeams and spider silk.</p>
<p>Finally, the Leopard of the Night, the most dangerous of all. Anansi knew that the Leopard was proud and loved to show off its strength. He challenged the Leopard to a contest of strength, claiming he could tie the Leopard to a tree. The Leopard, confident in its power, agreed. Anansi tied the Leopard securely, and the creature, realizing it had been tricked, could only roar in frustration.</p>
<p>With all four creatures captured, Anansi returned to Nyame's palace. The Sky God, impressed by Anansi's cleverness, presented him with the Box of Stories. From that day forward, Anansi became the keeper of all stories, sharing them with the world and teaching that wisdom and cunning can overcome even the greatest challenges.</p>`,
          contentText: "Anansi did not hesitate. With a bow to Nyame, he set off on his quest, his mind already working on plans to capture each of the four creatures. He knew that brute force would not work—these were beings of great power. Only cunning and wisdom would serve him now. First, he found the Python of the Deep Forest, a serpent so large that it could wrap around an entire tree. Anansi approached with respect and spoke to the Python with honeyed words, convincing it that he had discovered a way to measure its true length. The Python, curious and proud, agreed to stretch out along a branch while Anansi tied it with a rope, claiming he needed to measure it properly. Once the Python was secured, Anansi had captured his first prize. Next came the Hornet of the Swamp, a creature whose sting could paralyze even the strongest warrior. Anansi crafted a small gourd and filled it with water, then approached the Hornet's nest. He called out, claiming that a great storm was coming and that the Hornet should seek shelter in his gourd. The Hornet, seeing the wisdom in this, flew inside, and Anansi quickly sealed the opening. The Fairy of the Moonlight was trickier, for fairies are creatures of magic and cannot be caught by ordinary means. Anansi waited until the full moon, when the Fairy would be at her most powerful, and he began to tell her a story so captivating that she forgot to be cautious. As she leaned closer to hear the tale, Anansi captured her in a net woven from moonbeams and spider silk. Finally, the Leopard of the Night, the most dangerous of all. Anansi knew that the Leopard was proud and loved to show off its strength. He challenged the Leopard to a contest of strength, claiming he could tie the Leopard to a tree. The Leopard, confident in its power, agreed. Anansi tied the Leopard securely, and the creature, realizing it had been tricked, could only roar in frustration. With all four creatures captured, Anansi returned to Nyame's palace. The Sky God, impressed by Anansi's cleverness, presented him with the Box of Stories. From that day forward, Anansi became the keeper of all stories, sharing them with the world and teaching that wisdom and cunning can overcome even the greatest challenges."
        }
      ]
    }
  },
  {
    tokenId: 1002,
    title: "City Dreams",
    author: "0xZara9876543210fedcba",
    tribe: "Contemporary",
    language: "English",
    description: "A modern tale of ambition, identity, and finding one's place in the bustling city of Lagos.",
    image: "/african-modern-city-art.jpg",
    category: "Contemporary",
    createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    metadata: {
      name: "City Dreams",
      summary: "In the vibrant streets of Lagos, where dreams are born and sometimes shattered, a young woman named Ada navigates the complexities of modern African life, balancing tradition with ambition, family expectations with personal desires.",
      expressionType: "Contemporary",
      tags: ["Lagos", "Modern", "Identity", "Ambition", "Urban"],
      attributes: [
        { trait_type: "Expression Type", value: "Contemporary" },
        { trait_type: "Region", value: "West Africa" },
        { trait_type: "Tags", value: "Lagos,Modern,Identity,Ambition,Urban" }
      ],
      chapters: [
        {
          id: "ch1",
          title: "Chapter 1: Arrival",
          contentMarkdown: `# Arrival

The bus rumbled to a stop, and Ada stepped out into the chaos that was Lagos. The air hit her like a wall—thick with exhaust fumes, the scent of street food, and the unmistakable energy of a city that never slept. Around her, people moved in every direction, each with a purpose, each with a story.

Ada clutched her suitcase tightly, feeling both exhilarated and overwhelmed. This was it. After years of planning, saving, and dreaming, she had finally arrived in the city where she believed her future awaited. The skyscrapers towered above her, their glass facades reflecting the afternoon sun, while below, the streets teemed with life—traders calling out their wares, motorcycles weaving through traffic, and music blaring from every corner.

She had left her small village in Enugu with nothing but determination and a degree in computer science. Her family had been skeptical, her friends had been worried, but Ada had been resolute. Lagos was where opportunities lived, where dreams came true, where she could build something of her own.

As she navigated through the crowded streets, heading toward the address she had memorized, Ada felt a mixture of fear and excitement. This city would test her, challenge her, and perhaps even break her. But it would also make her stronger, wiser, and more herself than she had ever been before.`,
          contentHtml: `<h1>Arrival</h1>
<p>The bus rumbled to a stop, and Ada stepped out into the chaos that was Lagos. The air hit her like a wall—thick with exhaust fumes, the scent of street food, and the unmistakable energy of a city that never slept. Around her, people moved in every direction, each with a purpose, each with a story.</p>
<p>Ada clutched her suitcase tightly, feeling both exhilarated and overwhelmed. This was it. After years of planning, saving, and dreaming, she had finally arrived in the city where she believed her future awaited. The skyscrapers towered above her, their glass facades reflecting the afternoon sun, while below, the streets teemed with life—traders calling out their wares, motorcycles weaving through traffic, and music blaring from every corner.</p>
<p>She had left her small village in Enugu with nothing but determination and a degree in computer science. Her family had been skeptical, her friends had been worried, but Ada had been resolute. Lagos was where opportunities lived, where dreams came true, where she could build something of her own.</p>
<p>As she navigated through the crowded streets, heading toward the address she had memorized, Ada felt a mixture of fear and excitement. This city would test her, challenge her, and perhaps even break her. But it would also make her stronger, wiser, and more herself than she had ever been before.</p>`,
          contentText: "The bus rumbled to a stop, and Ada stepped out into the chaos that was Lagos. The air hit her like a wall—thick with exhaust fumes, the scent of street food, and the unmistakable energy of a city that never slept. Around her, people moved in every direction, each with a purpose, each with a story. Ada clutched her suitcase tightly, feeling both exhilarated and overwhelmed. This was it. After years of planning, saving, and dreaming, she had finally arrived in the city where she believed her future awaited. The skyscrapers towered above her, their glass facades reflecting the afternoon sun, while below, the streets teemed with life—traders calling out their wares, motorcycles weaving through traffic, and music blaring from every corner. She had left her small village in Enugu with nothing but determination and a degree in computer science. Her family had been skeptical, her friends had been worried, but Ada had been resolute. Lagos was where opportunities lived, where dreams came true, where she could build something of her own. As she navigated through the crowded streets, heading toward the address she had memorized, Ada felt a mixture of fear and excitement. This city would test her, challenge her, and perhaps even break her. But it would also make her stronger, wiser, and more herself than she had ever been before."
        },
        {
          id: "ch2",
          title: "Chapter 2: The Interview",
          contentMarkdown: `# The Interview

Two weeks after her arrival, Ada found herself standing outside a sleek office building in Victoria Island, her palms sweaty and her heart racing. This was her third interview, and she was determined to make it count. The previous two had ended in polite rejections, but this one felt different. This company, TechBridge Africa, was exactly the kind of place she had dreamed of working—innovative, forward-thinking, and committed to building technology solutions for African markets.

She smoothed down her blazer, took a deep breath, and entered the building. The lobby was modern and airy, with plants growing along the walls and natural light streaming through large windows. At the reception desk, a friendly woman directed her to the fifteenth floor.

The interview room was spacious, with a view of the city that made Ada's breath catch. She sat across from three interviewers: a woman in her forties with kind eyes, a man with graying hair and a warm smile, and a younger man who looked barely older than Ada herself.

"Tell us about yourself, Ada," the woman began.

Ada took a moment to compose herself, then spoke from the heart. She talked about her village, her family, her dreams. She spoke about the challenges she had faced and the obstacles she had overcome. She talked about her passion for technology and her vision for how it could transform lives across Africa.

As she spoke, she could see the interviewers nodding, their expressions shifting from polite interest to genuine engagement. They asked about her projects, her skills, her goals. Ada answered each question with confidence, drawing on everything she had learned, everything she had experienced.

When the interview ended, the woman shook her hand and said, "We'll be in touch, Ada. You've made quite an impression."`,
          contentHtml: `<h1>The Interview</h1>
<p>Two weeks after her arrival, Ada found herself standing outside a sleek office building in Victoria Island, her palms sweaty and her heart racing. This was her third interview, and she was determined to make it count. The previous two had ended in polite rejections, but this one felt different. This company, TechBridge Africa, was exactly the kind of place she had dreamed of working—innovative, forward-thinking, and committed to building technology solutions for African markets.</p>
<p>She smoothed down her blazer, took a deep breath, and entered the building. The lobby was modern and airy, with plants growing along the walls and natural light streaming through large windows. At the reception desk, a friendly woman directed her to the fifteenth floor.</p>
<p>The interview room was spacious, with a view of the city that made Ada's breath catch. She sat across from three interviewers: a woman in her forties with kind eyes, a man with graying hair and a warm smile, and a younger man who looked barely older than Ada herself.</p>
<p>"Tell us about yourself, Ada," the woman began.</p>
<p>Ada took a moment to compose herself, then spoke from the heart. She talked about her village, her family, her dreams. She spoke about the challenges she had faced and the obstacles she had overcome. She talked about her passion for technology and her vision for how it could transform lives across Africa.</p>
<p>As she spoke, she could see the interviewers nodding, their expressions shifting from polite interest to genuine engagement. They asked about her projects, her skills, her goals. Ada answered each question with confidence, drawing on everything she had learned, everything she had experienced.</p>
<p>When the interview ended, the woman shook her hand and said, "We'll be in touch, Ada. You've made quite an impression."</p>`,
          contentText: "Two weeks after her arrival, Ada found herself standing outside a sleek office building in Victoria Island, her palms sweaty and her heart racing. This was her third interview, and she was determined to make it count. The previous two had ended in polite rejections, but this one felt different. This company, TechBridge Africa, was exactly the kind of place she had dreamed of working—innovative, forward-thinking, and committed to building technology solutions for African markets. She smoothed down her blazer, took a deep breath, and entered the building. The lobby was modern and airy, with plants growing along the walls and natural light streaming through large windows. At the reception desk, a friendly woman directed her to the fifteenth floor. The interview room was spacious, with a view of the city that made Ada's breath catch. She sat across from three interviewers: a woman in her forties with kind eyes, a man with graying hair and a warm smile, and a younger man who looked barely older than Ada herself. Tell us about yourself, Ada, the woman began. Ada took a moment to compose herself, then spoke from the heart. She talked about her village, her family, her dreams. She spoke about the challenges she had faced and the obstacles she had overcome. She talked about her passion for technology and her vision for how it could transform lives across Africa. As she spoke, she could see the interviewers nodding, their expressions shifting from polite interest to genuine engagement. They asked about her projects, her skills, her goals. Ada answered each question with confidence, drawing on everything she had learned, everything she had experienced. When the interview ended, the woman shook her hand and said, We'll be in touch, Ada. You've made quite an impression."
        },
        {
          id: "ch3",
          title: "Chapter 3: Home",
          contentMarkdown: `# Home

Six months later, Ada sat in her small apartment, looking out at the city lights twinkling below. She had gotten the job at TechBridge Africa, and her life had transformed in ways she could never have imagined. She had made friends, found her rhythm, and discovered that Lagos, for all its chaos, had become home.

But something was missing. As she scrolled through photos of her family on her phone, she felt a pang of homesickness. Her mother's voice on their weekly calls was always warm, but Ada could hear the longing in it, the unspoken wish that her daughter would return.

Ada had built a life in Lagos, but she had also built a distance between herself and her roots. The traditions she had grown up with, the values her family held dear, the sense of community that had defined her childhood—all of it felt far away now.

One evening, as she walked through the market near her apartment, the smell of jollof rice and the sound of Igbo being spoken by a group of women made her stop. In that moment, she realized that home wasn't a place—it was the people, the traditions, the memories that shaped who you were.

She called her mother that night and told her about her realization. "Mama," she said, "I'm coming home for the holidays. I want to bring Lagos back with me, and I want to bring Enugu back to Lagos. I don't have to choose between my dreams and my roots. I can have both."

Her mother's laughter filled the phone, warm and full of love. "My child," she said, "you have always known this. You just needed to remember."

Ada smiled, looking out at the city that had become her home, knowing that she could carry both worlds within her, that she could be both the village girl from Enugu and the tech professional in Lagos, and that both were true, both were her.`,
          contentHtml: `<h1>Home</h1>
<p>Six months later, Ada sat in her small apartment, looking out at the city lights twinkling below. She had gotten the job at TechBridge Africa, and her life had transformed in ways she could never have imagined. She had made friends, found her rhythm, and discovered that Lagos, for all its chaos, had become home.</p>
<p>But something was missing. As she scrolled through photos of her family on her phone, she felt a pang of homesickness. Her mother's voice on their weekly calls was always warm, but Ada could hear the longing in it, the unspoken wish that her daughter would return.</p>
<p>Ada had built a life in Lagos, but she had also built a distance between herself and her roots. The traditions she had grown up with, the values her family held dear, the sense of community that had defined her childhood—all of it felt far away now.</p>
<p>One evening, as she walked through the market near her apartment, the smell of jollof rice and the sound of Igbo being spoken by a group of women made her stop. In that moment, she realized that home wasn't a place—it was the people, the traditions, the memories that shaped who you were.</p>
<p>She called her mother that night and told her about her realization. "Mama," she said, "I'm coming home for the holidays. I want to bring Lagos back with me, and I want to bring Enugu back to Lagos. I don't have to choose between my dreams and my roots. I can have both."</p>
<p>Her mother's laughter filled the phone, warm and full of love. "My child," she said, "you have always known this. You just needed to remember."</p>
<p>Ada smiled, looking out at the city that had become her home, knowing that she could carry both worlds within her, that she could be both the village girl from Enugu and the tech professional in Lagos, and that both were true, both were her.</p>`,
          contentText: "Six months later, Ada sat in her small apartment, looking out at the city lights twinkling below. She had gotten the job at TechBridge Africa, and her life had transformed in ways she could never have imagined. She had made friends, found her rhythm, and discovered that Lagos, for all its chaos, had become home. But something was missing. As she scrolled through photos of her family on her phone, she felt a pang of homesickness. Her mother's voice on their weekly calls was always warm, but Ada could hear the longing in it, the unspoken wish that her daughter would return. Ada had built a life in Lagos, but she had also built a distance between herself and her roots. The traditions she had grown up with, the values her family held dear, the sense of community that had defined her childhood—all of it felt far away now. One evening, as she walked through the market near her apartment, the smell of jollof rice and the sound of Igbo being spoken by a group of women made her stop. In that moment, she realized that home wasn't a place—it was the people, the traditions, the memories that shaped who you were. She called her mother that night and told her about her realization. Mama, she said, I'm coming home for the holidays. I want to bring Lagos back with me, and I want to bring Enugu back to Lagos. I don't have to choose between my dreams and my roots. I can have both. Her mother's laughter filled the phone, warm and full of love. My child, she said, you have always known this. You just needed to remember. Ada smiled, looking out at the city that had become her home, knowing that she could carry both worlds within her, that she could be both the village girl from Enugu and the tech professional in Lagos, and that both were true, both were her."
        }
      ]
    }
  },
  {
    tokenId: 1003,
    title: "Heritage Roots",
    author: "0xKofiabcdef1234567890",
    tribe: "Historical",
    language: "English",
    description: "A journey through time, exploring the rich history and cultural heritage of the Ashanti people.",
    image: "/african-heritage-culture-art.jpg",
    category: "Historical",
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    metadata: {
      name: "Heritage Roots",
      summary: "Through the eyes of three generations, we explore the Ashanti Kingdom's history, from the golden age of the empire to the struggles of colonization, and finally to the modern era of cultural reclamation and pride.",
      expressionType: "Historical",
      tags: ["Ashanti", "History", "Heritage", "Ghana", "Culture"],
      attributes: [
        { trait_type: "Expression Type", value: "Historical" },
        { trait_type: "Region", value: "West Africa" },
        { trait_type: "Tags", value: "Ashanti,History,Heritage,Ghana,Culture" }
      ],
      chapters: [
        {
          id: "ch1",
          title: "Chapter 1: The Golden Stool",
          contentMarkdown: `# The Golden Stool

In the year 1701, the Ashanti Kingdom stood at the height of its power. The Golden Stool, the sacred symbol of the Ashanti people, had been passed down through generations, each ruler adding to the kingdom's legacy of strength, wisdom, and unity.

Nana Osei Tutu, the Asantehene, sat in his palace in Kumasi, surrounded by his council of elders. The walls were adorned with kente cloth, each pattern telling a story, each color representing a value. Gold, for wealth and prosperity. Green, for growth and renewal. Red, for the blood of ancestors who had fought for freedom.

"The Golden Stool is not just a throne," Nana Osei Tutu told his son, Prince Opoku. "It is the soul of our people. It represents our unity, our strength, our connection to the ancestors. As long as the Golden Stool remains with us, the Ashanti people will never be broken."

Prince Opoku listened intently, his young mind absorbing every word. He had heard the stories of how the Golden Stool had descended from the sky, a gift from the gods, and how it had united the Ashanti clans into a powerful confederation. He understood that this was not just history—it was the foundation upon which his people's identity was built.

Outside the palace, the kingdom thrived. Traders from across West Africa came to Kumasi, bringing goods and stories from distant lands. The markets buzzed with activity, and the sound of drums echoed through the streets, calling people to celebration, to ceremony, to community.

But even in this golden age, whispers of change were beginning to reach the kingdom. Ships from across the ocean brought new people, new ideas, new challenges. The world was changing, and the Ashanti Kingdom would need to adapt while holding fast to the values that had made it great.`,
          contentHtml: `<h1>The Golden Stool</h1>
<p>In the year 1701, the Ashanti Kingdom stood at the height of its power. The Golden Stool, the sacred symbol of the Ashanti people, had been passed down through generations, each ruler adding to the kingdom's legacy of strength, wisdom, and unity.</p>
<p>Nana Osei Tutu, the Asantehene, sat in his palace in Kumasi, surrounded by his council of elders. The walls were adorned with kente cloth, each pattern telling a story, each color representing a value. Gold, for wealth and prosperity. Green, for growth and renewal. Red, for the blood of ancestors who had fought for freedom.</p>
<p>"The Golden Stool is not just a throne," Nana Osei Tutu told his son, Prince Opoku. "It is the soul of our people. It represents our unity, our strength, our connection to the ancestors. As long as the Golden Stool remains with us, the Ashanti people will never be broken."</p>
<p>Prince Opoku listened intently, his young mind absorbing every word. He had heard the stories of how the Golden Stool had descended from the sky, a gift from the gods, and how it had united the Ashanti clans into a powerful confederation. He understood that this was not just history—it was the foundation upon which his people's identity was built.</p>
<p>Outside the palace, the kingdom thrived. Traders from across West Africa came to Kumasi, bringing goods and stories from distant lands. The markets buzzed with activity, and the sound of drums echoed through the streets, calling people to celebration, to ceremony, to community.</p>
<p>But even in this golden age, whispers of change were beginning to reach the kingdom. Ships from across the ocean brought new people, new ideas, new challenges. The world was changing, and the Ashanti Kingdom would need to adapt while holding fast to the values that had made it great.</p>`,
          contentText: "In the year 1701, the Ashanti Kingdom stood at the height of its power. The Golden Stool, the sacred symbol of the Ashanti people, had been passed down through generations, each ruler adding to the kingdom's legacy of strength, wisdom, and unity. Nana Osei Tutu, the Asantehene, sat in his palace in Kumasi, surrounded by his council of elders. The walls were adorned with kente cloth, each pattern telling a story, each color representing a value. Gold, for wealth and prosperity. Green, for growth and renewal. Red, for the blood of ancestors who had fought for freedom. The Golden Stool is not just a throne, Nana Osei Tutu told his son, Prince Opoku. It is the soul of our people. It represents our unity, our strength, our connection to the ancestors. As long as the Golden Stool remains with us, the Ashanti people will never be broken. Prince Opoku listened intently, his young mind absorbing every word. He had heard the stories of how the Golden Stool had descended from the sky, a gift from the gods, and how it had united the Ashanti clans into a powerful confederation. He understood that this was not just history—it was the foundation upon which his people's identity was built. Outside the palace, the kingdom thrived. Traders from across West Africa came to Kumasi, bringing goods and stories from distant lands. The markets buzzed with activity, and the sound of drums echoed through the streets, calling people to celebration, to ceremony, to community. But even in this golden age, whispers of change were beginning to reach the kingdom. Ships from across the ocean brought new people, new ideas, new challenges. The world was changing, and the Ashanti Kingdom would need to adapt while holding fast to the values that had made it great."
        },
        {
          id: "ch2",
          title: "Chapter 2: The Resistance",
          contentMarkdown: `# The Resistance

By 1900, the world had changed dramatically. The Ashanti Kingdom, once a powerful independent state, now found itself under British colonial rule. But the spirit of resistance burned strong in the hearts of the people.

Yaa Asantewaa, the Queen Mother of Ejisu, stood before a gathering of Ashanti leaders, her voice strong and clear despite her age. "I see some of you are afraid to go forward and fight for our king," she declared. "If you, the men of Ashanti, will not go forward, then we will. We, the women, will. I shall call upon my fellow women. We will fight the white men. We will fight until the last of us falls in the battlefields."

Her words ignited a fire in the hearts of all who heard them. The Ashanti had never been a people to accept subjugation quietly. They had fought the British before, and they would fight again. The Golden Stool, hidden away to protect it from the colonizers, remained a symbol of their unbroken spirit.

Kofi, a young man who had grown up hearing stories of the kingdom's glory, joined the resistance. He had been educated in British schools, taught to see his own culture as inferior, but his grandmother's stories had kept the truth alive in his heart. The Ashanti were not a conquered people—they were a people in waiting, preserving their heritage until the day they could reclaim their freedom.

The war that followed was fierce and bloody. Yaa Asantewaa led her people with courage and determination, but the British forces, with their superior weapons and numbers, eventually prevailed. Yet even in defeat, the Ashanti had won something important: they had shown the world that their spirit could not be broken, that their heritage was worth fighting for, that the Golden Stool would always be theirs, no matter who claimed to rule their land.`,
          contentHtml: `<h1>The Resistance</h1>
<p>By 1900, the world had changed dramatically. The Ashanti Kingdom, once a powerful independent state, now found itself under British colonial rule. But the spirit of resistance burned strong in the hearts of the people.</p>
<p>Yaa Asantewaa, the Queen Mother of Ejisu, stood before a gathering of Ashanti leaders, her voice strong and clear despite her age. "I see some of you are afraid to go forward and fight for our king," she declared. "If you, the men of Ashanti, will not go forward, then we will. We, the women, will. I shall call upon my fellow women. We will fight the white men. We will fight until the last of us falls in the battlefields."</p>
<p>Her words ignited a fire in the hearts of all who heard them. The Ashanti had never been a people to accept subjugation quietly. They had fought the British before, and they would fight again. The Golden Stool, hidden away to protect it from the colonizers, remained a symbol of their unbroken spirit.</p>
<p>Kofi, a young man who had grown up hearing stories of the kingdom's glory, joined the resistance. He had been educated in British schools, taught to see his own culture as inferior, but his grandmother's stories had kept the truth alive in his heart. The Ashanti were not a conquered people—they were a people in waiting, preserving their heritage until the day they could reclaim their freedom.</p>
<p>The war that followed was fierce and bloody. Yaa Asantewaa led her people with courage and determination, but the British forces, with their superior weapons and numbers, eventually prevailed. Yet even in defeat, the Ashanti had won something important: they had shown the world that their spirit could not be broken, that their heritage was worth fighting for, that the Golden Stool would always be theirs, no matter who claimed to rule their land.</p>`,
          contentText: "By 1900, the world had changed dramatically. The Ashanti Kingdom, once a powerful independent state, now found itself under British colonial rule. But the spirit of resistance burned strong in the hearts of the people. Yaa Asantewaa, the Queen Mother of Ejisu, stood before a gathering of Ashanti leaders, her voice strong and clear despite her age. I see some of you are afraid to go forward and fight for our king, she declared. If you, the men of Ashanti, will not go forward, then we will. We, the women, will. I shall call upon my fellow women. We will fight the white men. We will fight until the last of us falls in the battlefields. Her words ignited a fire in the hearts of all who heard them. The Ashanti had never been a people to accept subjugation quietly. They had fought the British before, and they would fight again. The Golden Stool, hidden away to protect it from the colonizers, remained a symbol of their unbroken spirit. Kofi, a young man who had grown up hearing stories of the kingdom's glory, joined the resistance. He had been educated in British schools, taught to see his own culture as inferior, but his grandmother's stories had kept the truth alive in his heart. The Ashanti were not a conquered people—they were a people in waiting, preserving their heritage until the day they could reclaim their freedom. The war that followed was fierce and bloody. Yaa Asantewaa led her people with courage and determination, but the British forces, with their superior weapons and numbers, eventually prevailed. Yet even in defeat, the Ashanti had won something important: they had shown the world that their spirit could not be broken, that their heritage was worth fighting for, that the Golden Stool would always be theirs, no matter who claimed to rule their land."
        },
        {
          id: "ch3",
          title: "Chapter 3: Reclamation",
          contentMarkdown: `# Reclamation

In 2024, Ama stood in the National Museum of Ghana, looking at an exhibit dedicated to the Ashanti Kingdom. She was a historian, a researcher, and most importantly, a descendant of the Ashanti people. Her work focused on reclaiming and preserving the stories that had been suppressed, distorted, or forgotten during the colonial era.

The exhibit before her told the story of the Golden Stool, of Yaa Asantewaa's resistance, of the kingdom's golden age. But it also told the story of survival, of cultural preservation, of a people who had maintained their identity despite centuries of attempts to erase it.

Ama had spent years traveling across Ghana, collecting oral histories from elders, translating ancient texts, and piecing together the full picture of her people's heritage. She had discovered stories that had never been written down, traditions that had been passed from generation to generation, knowledge that had been preserved in the hearts and minds of the people.

As she walked through the exhibit, she saw groups of schoolchildren listening intently to their teachers, their eyes wide with wonder as they learned about their own history. This was what her work was about—not just preserving the past, but ensuring that future generations would know who they were, where they came from, and what their ancestors had achieved.

Later that day, Ama visited her grandmother, who still lived in Kumasi. The old woman sat in her courtyard, weaving kente cloth, her hands moving with the skill of decades of practice.

"Grandmother," Ama said, "I've been thinking about what you told me when I was a child. You said that the Golden Stool is not just a symbol—it's a promise. A promise that as long as we remember who we are, we will never be truly conquered."

Her grandmother smiled, her eyes crinkling at the corners. "Yes, my child. And you, with your work, you are keeping that promise. You are helping us remember, helping us reclaim what was always ours."

Ama felt a deep sense of purpose settle over her. The heritage of the Ashanti people was not just history—it was a living, breathing thing, passed down through stories, through traditions, through the unbreakable connection between generations. And as long as there were people like her, people who remembered, who preserved, who taught, that heritage would never die.`,
          contentHtml: `<h1>Reclamation</h1>
<p>In 2024, Ama stood in the National Museum of Ghana, looking at an exhibit dedicated to the Ashanti Kingdom. She was a historian, a researcher, and most importantly, a descendant of the Ashanti people. Her work focused on reclaiming and preserving the stories that had been suppressed, distorted, or forgotten during the colonial era.</p>
<p>The exhibit before her told the story of the Golden Stool, of Yaa Asantewaa's resistance, of the kingdom's golden age. But it also told the story of survival, of cultural preservation, of a people who had maintained their identity despite centuries of attempts to erase it.</p>
<p>Ama had spent years traveling across Ghana, collecting oral histories from elders, translating ancient texts, and piecing together the full picture of her people's heritage. She had discovered stories that had never been written down, traditions that had been passed from generation to generation, knowledge that had been preserved in the hearts and minds of the people.</p>
<p>As she walked through the exhibit, she saw groups of schoolchildren listening intently to their teachers, their eyes wide with wonder as they learned about their own history. This was what her work was about—not just preserving the past, but ensuring that future generations would know who they were, where they came from, and what their ancestors had achieved.</p>
<p>Later that day, Ama visited her grandmother, who still lived in Kumasi. The old woman sat in her courtyard, weaving kente cloth, her hands moving with the skill of decades of practice.</p>
<p>"Grandmother," Ama said, "I've been thinking about what you told me when I was a child. You said that the Golden Stool is not just a symbol—it's a promise. A promise that as long as we remember who we are, we will never be truly conquered."</p>
<p>Her grandmother smiled, her eyes crinkling at the corners. "Yes, my child. And you, with your work, you are keeping that promise. You are helping us remember, helping us reclaim what was always ours."</p>
<p>Ama felt a deep sense of purpose settle over her. The heritage of the Ashanti people was not just history—it was a living, breathing thing, passed down through stories, through traditions, through the unbreakable connection between generations. And as long as there were people like her, people who remembered, who preserved, who taught, that heritage would never die.</p>`,
          contentText: "In 2024, Ama stood in the National Museum of Ghana, looking at an exhibit dedicated to the Ashanti Kingdom. She was a historian, a researcher, and most importantly, a descendant of the Ashanti people. Her work focused on reclaiming and preserving the stories that had been suppressed, distorted, or forgotten during the colonial era. The exhibit before her told the story of the Golden Stool, of Yaa Asantewaa's resistance, of the kingdom's golden age. But it also told the story of survival, of cultural preservation, of a people who had maintained their identity despite centuries of attempts to erase it. Ama had spent years traveling across Ghana, collecting oral histories from elders, translating ancient texts, and piecing together the full picture of her people's heritage. She had discovered stories that had never been written down, traditions that had been passed from generation to generation, knowledge that had been preserved in the hearts and minds of the people. As she walked through the exhibit, she saw groups of schoolchildren listening intently to their teachers, their eyes wide with wonder as they learned about their own history. This was what her work was about—not just preserving the past, but ensuring that future generations would know who they were, where they came from, and what their ancestors had achieved. Later that day, Ama visited her grandmother, who still lived in Kumasi. The old woman sat in her courtyard, weaving kente cloth, her hands moving with the skill of decades of practice. Grandmother, Ama said, I've been thinking about what you told me when I was a child. You said that the Golden Stool is not just a symbol—it's a promise. A promise that as long as we remember who we are, we will never be truly conquered. Her grandmother smiled, her eyes crinkling at the corners. Yes, my child. And you, with your work, you are keeping that promise. You are helping us remember, helping us reclaim what was always ours. Ama felt a deep sense of purpose settle over her. The heritage of the Ashanti people was not just history—it was a living, breathing thing, passed down through stories, through traditions, through the unbreakable connection between generations. And as long as there were people like her, people who remembered, who preserved, who taught, that heritage would never die."
        }
      ]
    }
  },
  {
    tokenId: 1004,
    title: "The Baobab's Wisdom",
    author: "0xAmina9876543210fedcba",
    tribe: "Folklore",
    language: "Swahili",
    description: "An ancient tale passed down through generations about the wise baobab tree and the lessons it teaches.",
    image: "/african-ancestral-traditions.jpg",
    category: "Folklore",
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    metadata: {
      name: "The Baobab's Wisdom",
      summary: "In the vast savannah, where the sun beats down and the earth thirsts for rain, stands the baobab tree—a guardian of time, a keeper of secrets, and a teacher of wisdom.",
      expressionType: "Folklore",
      tags: ["Baobab", "Wisdom", "Ancestors", "Savannah", "Tradition"],
      attributes: [
        { trait_type: "Expression Type", value: "Folklore" },
        { trait_type: "Region", value: "East Africa" },
        { trait_type: "Tags", value: "Baobab,Wisdom,Ancestors,Savannah,Tradition" }
      ],
      chapters: [
        {
          id: "ch1",
          title: "Chapter 1: The Ancient Tree",
          contentMarkdown: `# The Ancient Tree

In the heart of the savannah, where the horizon stretches endlessly and the sky meets the earth in a perfect line, there stood a baobab tree so old that no one could remember when it first took root. Its trunk was massive, wide enough for ten people to stand around, and its branches reached toward the heavens like gnarled fingers grasping for the stars.

The villagers called it Mzee Mti—the Elder Tree—and they believed it held the wisdom of all the ancestors who had come before. Children were told never to harm it, for it was sacred. Elders would gather beneath its shade to tell stories, make decisions, and pass down the knowledge that had been entrusted to them.

One day, a young girl named Zawadi came to the tree. She was troubled, her heart heavy with questions about her place in the world, about the meaning of her life, about the path she should take. She sat beneath the baobab, her back against its ancient bark, and closed her eyes.

"Great tree," she whispered, "I need your wisdom. I am lost, and I don't know which way to turn."

The wind rustled through the leaves, and Zawadi felt as if the tree itself was speaking to her, its voice carried on the breeze. "Child," it seemed to say, "wisdom is not given—it is earned. Look around you, and you will find the answers you seek."`,
          contentHtml: `<h1>The Ancient Tree</h1>
<p>In the heart of the savannah, where the horizon stretches endlessly and the sky meets the earth in a perfect line, there stood a baobab tree so old that no one could remember when it first took root. Its trunk was massive, wide enough for ten people to stand around, and its branches reached toward the heavens like gnarled fingers grasping for the stars.</p>
<p>The villagers called it Mzee Mti—the Elder Tree—and they believed it held the wisdom of all the ancestors who had come before. Children were told never to harm it, for it was sacred. Elders would gather beneath its shade to tell stories, make decisions, and pass down the knowledge that had been entrusted to them.</p>
<p>One day, a young girl named Zawadi came to the tree. She was troubled, her heart heavy with questions about her place in the world, about the meaning of her life, about the path she should take. She sat beneath the baobab, her back against its ancient bark, and closed her eyes.</p>
<p>"Great tree," she whispered, "I need your wisdom. I am lost, and I don't know which way to turn."</p>
<p>The wind rustled through the leaves, and Zawadi felt as if the tree itself was speaking to her, its voice carried on the breeze. "Child," it seemed to say, "wisdom is not given—it is earned. Look around you, and you will find the answers you seek."</p>`,
          contentText: "In the heart of the savannah, where the horizon stretches endlessly and the sky meets the earth in a perfect line, there stood a baobab tree so old that no one could remember when it first took root. Its trunk was massive, wide enough for ten people to stand around, and its branches reached toward the heavens like gnarled fingers grasping for the stars. The villagers called it Mzee Mti—the Elder Tree—and they believed it held the wisdom of all the ancestors who had come before. Children were told never to harm it, for it was sacred. Elders would gather beneath its shade to tell stories, make decisions, and pass down the knowledge that had been entrusted to them. One day, a young girl named Zawadi came to the tree. She was troubled, her heart heavy with questions about her place in the world, about the meaning of her life, about the path she should take. She sat beneath the baobab, her back against its ancient bark, and closed her eyes. Great tree, she whispered, I need your wisdom. I am lost, and I don't know which way to turn. The wind rustled through the leaves, and Zawadi felt as if the tree itself was speaking to her, its voice carried on the breeze. Child, it seemed to say, wisdom is not given—it is earned. Look around you, and you will find the answers you seek."
        },
        {
          id: "ch2",
          title: "Chapter 2: The Lessons",
          contentMarkdown: `# The Lessons

Zawadi opened her eyes and looked around. She saw the ants marching in a line, each one carrying a burden many times its own weight, working together for the good of the colony. She saw the birds building nests, carefully selecting each twig, each piece of grass, creating a home for their young.

She saw the elders sitting in a circle, their faces lined with age and experience, their hands gesturing as they spoke. They were discussing the village's problems, listening to each other, finding solutions together.

And she saw the children playing, their laughter ringing through the air, their joy infectious and pure. They were learning, growing, becoming who they were meant to be.

As she watched, Zawadi began to understand. The wisdom she sought wasn't hidden in the tree—it was all around her, in the way the ants worked together, in the way the birds built their nests, in the way the elders shared their knowledge, in the way the children played and learned.

The baobab tree had been right. Wisdom wasn't something you received—it was something you discovered by paying attention, by observing, by learning from everything and everyone around you.`,
          contentHtml: `<h1>The Lessons</h1>
<p>Zawadi opened her eyes and looked around. She saw the ants marching in a line, each one carrying a burden many times its own weight, working together for the good of the colony. She saw the birds building nests, carefully selecting each twig, each piece of grass, creating a home for their young.</p>
<p>She saw the elders sitting in a circle, their faces lined with age and experience, their hands gesturing as they spoke. They were discussing the village's problems, listening to each other, finding solutions together.</p>
<p>And she saw the children playing, their laughter ringing through the air, their joy infectious and pure. They were learning, growing, becoming who they were meant to be.</p>
<p>As she watched, Zawadi began to understand. The wisdom she sought wasn't hidden in the tree—it was all around her, in the way the ants worked together, in the way the birds built their nests, in the way the elders shared their knowledge, in the way the children played and learned.</p>
<p>The baobab tree had been right. Wisdom wasn't something you received—it was something you discovered by paying attention, by observing, by learning from everything and everyone around you.</p>`,
          contentText: "Zawadi opened her eyes and looked around. She saw the ants marching in a line, each one carrying a burden many times its own weight, working together for the good of the colony. She saw the birds building nests, carefully selecting each twig, each piece of grass, creating a home for their young. She saw the elders sitting in a circle, their faces lined with age and experience, their hands gesturing as they spoke. They were discussing the village's problems, listening to each other, finding solutions together. And she saw the children playing, their laughter ringing through the air, their joy infectious and pure. They were learning, growing, becoming who they were meant to be. As she watched, Zawadi began to understand. The wisdom she sought wasn't hidden in the tree—it was all around her, in the way the ants worked together, in the way the birds built their nests, in the way the elders shared their knowledge, in the way the children played and learned. The baobab tree had been right. Wisdom wasn't something you received—it was something you discovered by paying attention, by observing, by learning from everything and everyone around you."
        },
        {
          id: "ch3",
          title: "Chapter 3: The Understanding",
          contentMarkdown: `# The Understanding

From that day forward, Zawadi became a seeker of wisdom. She spent her days observing, learning, asking questions, and listening. She learned from the elders, from the children, from the animals, from the land itself.

She discovered that wisdom wasn't a destination—it was a journey. It wasn't something you possessed—it was something you practiced. And most importantly, she learned that the greatest wisdom came from understanding that you would never know everything, but that was okay, because the joy was in the learning itself.

Years passed, and Zawadi grew into a wise woman. She became an elder herself, and she would sit beneath the baobab tree, sharing stories with the next generation, passing down the wisdom she had gathered throughout her life.

And when young people came to her with questions, she would tell them what the baobab had taught her: "Look around you. The answers are everywhere. You just need to learn how to see them."

The baobab tree still stands in the savannah, its branches reaching toward the sky, its roots deep in the earth, a symbol of the wisdom that comes from patience, from observation, from the understanding that the greatest lessons are often the simplest ones, hidden in plain sight for those who know how to look.`,
          contentHtml: `<h1>The Understanding</h1>
<p>From that day forward, Zawadi became a seeker of wisdom. She spent her days observing, learning, asking questions, and listening. She learned from the elders, from the children, from the animals, from the land itself.</p>
<p>She discovered that wisdom wasn't a destination—it was a journey. It wasn't something you possessed—it was something you practiced. And most importantly, she learned that the greatest wisdom came from understanding that you would never know everything, but that was okay, because the joy was in the learning itself.</p>
<p>Years passed, and Zawadi grew into a wise woman. She became an elder herself, and she would sit beneath the baobab tree, sharing stories with the next generation, passing down the wisdom she had gathered throughout her life.</p>
<p>And when young people came to her with questions, she would tell them what the baobab had taught her: "Look around you. The answers are everywhere. You just need to learn how to see them."</p>
<p>The baobab tree still stands in the savannah, its branches reaching toward the sky, its roots deep in the earth, a symbol of the wisdom that comes from patience, from observation, from the understanding that the greatest lessons are often the simplest ones, hidden in plain sight for those who know how to look.</p>`,
          contentText: "From that day forward, Zawadi became a seeker of wisdom. She spent her days observing, learning, asking questions, and listening. She learned from the elders, from the children, from the animals, from the land itself. She discovered that wisdom wasn't a destination—it was a journey. It wasn't something you possessed—it was something you practiced. And most importantly, she learned that the greatest wisdom came from understanding that you would never know everything, but that was okay, because the joy was in the learning itself. Years passed, and Zawadi grew into a wise woman. She became an elder herself, and she would sit beneath the baobab tree, sharing stories with the next generation, passing down the wisdom she had gathered throughout her life. And when young people came to her with questions, she would tell them what the baobab had taught her: Look around you. The answers are everywhere. You just need to learn how to see them. The baobab tree still stands in the savannah, its branches reaching toward the sky, its roots deep in the earth, a symbol of the wisdom that comes from patience, from observation, from the understanding that the greatest lessons are often the simplest ones, hidden in plain sight for those who know how to look."
        }
      ]
    }
  },
  {
    tokenId: 1005,
    title: "Drumbeats of Freedom",
    author: "0xJabariabcdef1234567890",
    tribe: "Historical",
    language: "English",
    description: "A powerful narrative of resistance, resilience, and the unbreakable spirit of a people fighting for freedom.",
    image: "/african-activism-history.jpg",
    category: "Historical",
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    metadata: {
      name: "Drumbeats of Freedom",
      summary: "In the darkest hours of oppression, when hope seemed lost and freedom felt like a distant dream, the drums began to beat. They carried messages across mountains and valleys, through forests and across rivers, uniting a people in their quest for liberation.",
      expressionType: "Historical",
      tags: ["Freedom", "Resistance", "Liberation", "Unity", "Courage"],
      attributes: [
        { trait_type: "Expression Type", value: "Historical" },
        { trait_type: "Region", value: "Pan-African" },
        { trait_type: "Tags", value: "Freedom,Resistance,Liberation,Unity,Courage" }
      ],
      chapters: [
        {
          id: "ch1",
          title: "Chapter 1: The Call",
          contentMarkdown: `# The Call

The drums started at dawn, their rhythm cutting through the morning mist like a blade. In the village, people stopped what they were doing and listened. The message was clear, though no words were spoken—only the beat, the pulse, the call to action.

Kofi, a young man who had grown up hearing stories of freedom fighters, felt his heart quicken. He knew what the drums meant. The time had come. The oppressors had pushed too far, taken too much, broken too many promises. The people would no longer remain silent.

He looked at his mother, saw the determination in her eyes, the fire that had never been extinguished despite years of hardship. He looked at his father, saw the strength in his shoulders, the resolve in his stance. And he looked at his younger siblings, saw the hope in their faces, the belief that a better world was possible.

"The drums are calling," his father said, his voice steady. "It is time."`,
          contentHtml: `<h1>The Call</h1>
<p>The drums started at dawn, their rhythm cutting through the morning mist like a blade. In the village, people stopped what they were doing and listened. The message was clear, though no words were spoken—only the beat, the pulse, the call to action.</p>
<p>Kofi, a young man who had grown up hearing stories of freedom fighters, felt his heart quicken. He knew what the drums meant. The time had come. The oppressors had pushed too far, taken too much, broken too many promises. The people would no longer remain silent.</p>
<p>He looked at his mother, saw the determination in her eyes, the fire that had never been extinguished despite years of hardship. He looked at his father, saw the strength in his shoulders, the resolve in his stance. And he looked at his younger siblings, saw the hope in their faces, the belief that a better world was possible.</p>
<p>"The drums are calling," his father said, his voice steady. "It is time."</p>`,
          contentText: "The drums started at dawn, their rhythm cutting through the morning mist like a blade. In the village, people stopped what they were doing and listened. The message was clear, though no words were spoken—only the beat, the pulse, the call to action. Kofi, a young man who had grown up hearing stories of freedom fighters, felt his heart quicken. He knew what the drums meant. The time had come. The oppressors had pushed too far, taken too much, broken too many promises. The people would no longer remain silent. He looked at his mother, saw the determination in her eyes, the fire that had never been extinguished despite years of hardship. He looked at his father, saw the strength in his shoulders, the resolve in his stance. And he looked at his younger siblings, saw the hope in their faces, the belief that a better world was possible. The drums are calling, his father said, his voice steady. It is time."
        },
        {
          id: "ch2",
          title: "Chapter 2: The Gathering",
          contentMarkdown: `# The Gathering

From every village, from every town, from every corner of the land, they came. Men and women, young and old, united by a common purpose. They gathered in the clearing, beneath the great tree that had witnessed generations of struggle, and they listened as their leaders spoke.

"We have been patient," said Nana Adjoa, an elder whose voice carried the weight of years. "We have been peaceful. We have tried to reason, to negotiate, to find a way forward that did not require conflict. But our patience has been mistaken for weakness, and our peace has been taken for granted."

The crowd murmured in agreement. They had all felt the weight of oppression, had all experienced the injustice, had all dreamed of a day when they would be free.

"We are not asking for anything that is not rightfully ours," continued Nana Adjoa. "We are asking for our freedom, for our dignity, for our right to determine our own destiny. And if they will not give it to us, then we will take it."

The drums began to beat again, louder this time, more urgent. The people raised their voices in response, a chorus of determination, of resolve, of unity. They were ready. They were willing. They would not be stopped.`,
          contentHtml: `<h1>The Gathering</h1>
<p>From every village, from every town, from every corner of the land, they came. Men and women, young and old, united by a common purpose. They gathered in the clearing, beneath the great tree that had witnessed generations of struggle, and they listened as their leaders spoke.</p>
<p>"We have been patient," said Nana Adjoa, an elder whose voice carried the weight of years. "We have been peaceful. We have tried to reason, to negotiate, to find a way forward that did not require conflict. But our patience has been mistaken for weakness, and our peace has been taken for granted."</p>
<p>The crowd murmured in agreement. They had all felt the weight of oppression, had all experienced the injustice, had all dreamed of a day when they would be free.</p>
<p>"We are not asking for anything that is not rightfully ours," continued Nana Adjoa. "We are asking for our freedom, for our dignity, for our right to determine our own destiny. And if they will not give it to us, then we will take it."</p>
<p>The drums began to beat again, louder this time, more urgent. The people raised their voices in response, a chorus of determination, of resolve, of unity. They were ready. They were willing. They would not be stopped.</p>`,
          contentText: "From every village, from every town, from every corner of the land, they came. Men and women, young and old, united by a common purpose. They gathered in the clearing, beneath the great tree that had witnessed generations of struggle, and they listened as their leaders spoke. We have been patient, said Nana Adjoa, an elder whose voice carried the weight of years. We have been peaceful. We have tried to reason, to negotiate, to find a way forward that did not require conflict. But our patience has been mistaken for weakness, and our peace has been taken for granted. The crowd murmured in agreement. They had all felt the weight of oppression, had all experienced the injustice, had all dreamed of a day when they would be free. We are not asking for anything that is not rightfully ours, continued Nana Adjoa. We are asking for our freedom, for our dignity, for our right to determine our own destiny. And if they will not give it to us, then we will take it. The drums began to beat again, louder this time, more urgent. The people raised their voices in response, a chorus of determination, of resolve, of unity. They were ready. They were willing. They would not be stopped."
        },
        {
          id: "ch3",
          title: "Chapter 3: The Victory",
          contentMarkdown: `# The Victory

The struggle was long and hard. There were losses, setbacks, moments when it seemed that all hope was lost. But the people did not give up. They remembered why they were fighting, remembered the generations that had come before them, remembered the generations that would come after.

They fought not just with weapons, but with words, with ideas, with the unshakeable belief that freedom was their birthright. They organized, they strategized, they supported each other, and slowly, inexorably, they began to win.

The day finally came when the oppressors left, when the flag of freedom was raised, when the drums beat not in warning, but in celebration. The people danced in the streets, their voices raised in song, their hearts full of joy and pride.

But they also remembered. They remembered the cost of freedom, the sacrifices that had been made, the lives that had been lost. They vowed to honor those sacrifices by building a nation that was truly free, truly just, truly their own.

And the drums continued to beat, not just in celebration, but as a reminder—a reminder of the struggle, of the victory, of the responsibility that came with freedom. They beat for the past, for the present, and for the future, a rhythm that would never be silenced, a call that would never be forgotten.`,
          contentHtml: `<h1>The Victory</h1>
<p>The struggle was long and hard. There were losses, setbacks, moments when it seemed that all hope was lost. But the people did not give up. They remembered why they were fighting, remembered the generations that had come before them, remembered the generations that would come after.</p>
<p>They fought not just with weapons, but with words, with ideas, with the unshakeable belief that freedom was their birthright. They organized, they strategized, they supported each other, and slowly, inexorably, they began to win.</p>
<p>The day finally came when the oppressors left, when the flag of freedom was raised, when the drums beat not in warning, but in celebration. The people danced in the streets, their voices raised in song, their hearts full of joy and pride.</p>
<p>But they also remembered. They remembered the cost of freedom, the sacrifices that had been made, the lives that had been lost. They vowed to honor those sacrifices by building a nation that was truly free, truly just, truly their own.</p>
<p>And the drums continued to beat, not just in celebration, but as a reminder—a reminder of the struggle, of the victory, of the responsibility that came with freedom. They beat for the past, for the present, and for the future, a rhythm that would never be silenced, a call that would never be forgotten.</p>`,
          contentText: "The struggle was long and hard. There were losses, setbacks, moments when it seemed that all hope was lost. But the people did not give up. They remembered why they were fighting, remembered the generations that had come before them, remembered the generations that would come after. They fought not just with weapons, but with words, with ideas, with the unshakeable belief that freedom was their birthright. They organized, they strategized, they supported each other, and slowly, inexorably, they began to win. The day finally came when the oppressors left, when the flag of freedom was raised, when the drums beat not in warning, but in celebration. The people danced in the streets, their voices raised in song, their hearts full of joy and pride. But they also remembered. They remembered the cost of freedom, the sacrifices that had been made, the lives that had been lost. They vowed to honor those sacrifices by building a nation that was truly free, truly just, truly their own. And the drums continued to beat, not just in celebration, but as a reminder—a reminder of the struggle, of the victory, of the responsibility that came with freedom. They beat for the past, for the present, and for the future, a rhythm that would never be silenced, a call that would never be forgotten."
        }
      ]
    }
  },
  {
    tokenId: 1006,
    title: "After Midnight",
    author: "0xSherahDaniels1234567890abcdef",
    tribe: "Horror",
    language: "English",
    description: "A chilling tale of a late-night encounter that turns into a nightmare beyond imagination.",
    image: "/african-heritage-culture-art.jpg",
    category: "Horror",
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    metadata: {
      name: "After Midnight",
      summary: "I went out last night to turn on the pump. It was already 11 p.m., and my mother shook me awake because she wanted to take her bath. What started as a simple errand in the dark became a terrifying encounter with something beyond understanding.",
      expressionType: "Horror",
      tags: ["horror", "supernatural", "nightmare", "fear"],
      attributes: [
        { trait_type: "Expression Type", value: "Horror" },
        { trait_type: "Genre", value: "horror" },
        { trait_type: "Tags", value: "horror,supernatural,nightmare,fear" }
      ],
      chapters: [
        {
          id: "ch1",
          title: "Chapter 1: The Awakening",
          contentMarkdown: `# The Awakening

I went out last night to turn on the pump.

It was already 11 p.m., and my mother shook me awake because she wanted to take her bath. I woke to the heavy heat of the room pressing against my skin, the type that made the walls feel closer than they actually were. My eyes burned from sleep, but she stood over me with that quiet urgency she gets sometimes.

Annoyance sat heavy in my chest—not loud, just hot, like the air itself. We were all suffering this heat. Why couldn't she wait?

I dragged myself out of bed, muttering under my breath, and slipped my feet into the nearest slippers. She promised to follow me, even apologized for waking me. It wasn't the apology that bothered me—it was how soft her voice sounded, almost fragile. Not like her.

But I pushed the thought away.

We stepped outside, and the night wrapped around us like wet cloth—dark, thick, humming with its own life. I flicked on my torch, its weak beam dancing across the ground and the bush behind our house. Our area had always been a place where strange things passed through—the crawling ones you could see, and the others you could only feel.

And always, at night, the witches played their drums in the distance.

Tonight, the silence was too clean.`,
          contentHtml: `<h1>The Awakening</h1>
<p>I went out last night to turn on the pump.</p>
<p>It was already 11 p.m., and my mother shook me awake because she wanted to take her bath. I woke to the heavy heat of the room pressing against my skin, the type that made the walls feel closer than they actually were. My eyes burned from sleep, but she stood over me with that quiet urgency she gets sometimes.</p>
<p>Annoyance sat heavy in my chest—not loud, just hot, like the air itself. We were all suffering this heat. Why couldn't she wait?</p>
<p>I dragged myself out of bed, muttering under my breath, and slipped my feet into the nearest slippers. She promised to follow me, even apologized for waking me. It wasn't the apology that bothered me—it was how soft her voice sounded, almost fragile. Not like her.</p>
<p>But I pushed the thought away.</p>
<p>We stepped outside, and the night wrapped around us like wet cloth—dark, thick, humming with its own life. I flicked on my torch, its weak beam dancing across the ground and the bush behind our house. Our area had always been a place where strange things passed through—the crawling ones you could see, and the others you could only feel.</p>
<p>And always, at night, the witches played their drums in the distance.</p>
<p>Tonight, the silence was too clean.</p>`,
          contentText: "I went out last night to turn on the pump. It was already 11 p.m., and my mother shook me awake because she wanted to take her bath. I woke to the heavy heat of the room pressing against my skin, the type that made the walls feel closer than they actually were. My eyes burned from sleep, but she stood over me with that quiet urgency she gets sometimes. Annoyance sat heavy in my chest—not loud, just hot, like the air itself. We were all suffering this heat. Why couldn't she wait? I dragged myself out of bed, muttering under my breath, and slipped my feet into the nearest slippers. She promised to follow me, even apologized for waking me. It wasn't the apology that bothered me—it was how soft her voice sounded, almost fragile. Not like her. But I pushed the thought away. We stepped outside, and the night wrapped around us like wet cloth—dark, thick, humming with its own life. I flicked on my torch, its weak beam dancing across the ground and the bush behind our house. Our area had always been a place where strange things passed through—the crawling ones you could see, and the others you could only feel. And always, at night, the witches played their drums in the distance. Tonight, the silence was too clean."
        },
        {
          id: "ch2",
          title: "Chapter 2: The Encounter",
          contentMarkdown: `# The Encounter

I walked slowly, feeling the gravel shift under my feet, checking over my shoulder every few steps to make sure my mother was still behind me. She kept close, but her breathing sounded… different. A little too calm.

We hadn't even reached the pump when something slipped across my leg.

Cold. Long. Smooth like a wet rope.

I didn't think—I just jumped back and ran.

My slippers slapped the ground loudly as I sprinted across the compound. My mother shouted my name, her voice cracking in a way I'd never heard, but fear pushed everything else to the edges of my mind.

By the time I reached the steps of the house, my heart was knocking so hard I could feel it in my throat. I slammed my hand against the wall to steady myself—

But the wall closed fingers around mine.

Human fingers.

Warm, firm, and deliberate.

My blood froze. The world narrowed to the slow turn of my head as I looked up.

A cat—as tall as a human, shoulders broad, eyes glowing yellow like lanterns—stood beside me. Its whiskers twitched, and its lips curled into something that wasn't quite a smile.

"Boo," it said.

Just that.

My mind didn't break, but it bent. I ripped my hand free and stumbled inside the house, slamming the door behind me.`,
          contentHtml: `<h1>The Encounter</h1>
<p>I walked slowly, feeling the gravel shift under my feet, checking over my shoulder every few steps to make sure my mother was still behind me. She kept close, but her breathing sounded… different. A little too calm.</p>
<p>We hadn't even reached the pump when something slipped across my leg.</p>
<p>Cold. Long. Smooth like a wet rope.</p>
<p>I didn't think—I just jumped back and ran.</p>
<p>My slippers slapped the ground loudly as I sprinted across the compound. My mother shouted my name, her voice cracking in a way I'd never heard, but fear pushed everything else to the edges of my mind.</p>
<p>By the time I reached the steps of the house, my heart was knocking so hard I could feel it in my throat. I slammed my hand against the wall to steady myself—</p>
<p>But the wall closed fingers around mine.</p>
<p>Human fingers.</p>
<p>Warm, firm, and deliberate.</p>
<p>My blood froze. The world narrowed to the slow turn of my head as I looked up.</p>
<p>A cat—as tall as a human, shoulders broad, eyes glowing yellow like lanterns—stood beside me. Its whiskers twitched, and its lips curled into something that wasn't quite a smile.</p>
<p>"Boo," it said.</p>
<p>Just that.</p>
<p>My mind didn't break, but it bent. I ripped my hand free and stumbled inside the house, slamming the door behind me.</p>`,
          contentText: "I walked slowly, feeling the gravel shift under my feet, checking over my shoulder every few steps to make sure my mother was still behind me. She kept close, but her breathing sounded… different. A little too calm. We hadn't even reached the pump when something slipped across my leg. Cold. Long. Smooth like a wet rope. I didn't think—I just jumped back and ran. My slippers slapped the ground loudly as I sprinted across the compound. My mother shouted my name, her voice cracking in a way I'd never heard, but fear pushed everything else to the edges of my mind. By the time I reached the steps of the house, my heart was knocking so hard I could feel it in my throat. I slammed my hand against the wall to steady myself— But the wall closed fingers around mine. Human fingers. Warm, firm, and deliberate. My blood froze. The world narrowed to the slow turn of my head as I looked up. A cat—as tall as a human, shoulders broad, eyes glowing yellow like lanterns—stood beside me. Its whiskers twitched, and its lips curled into something that wasn't quite a smile. Boo, it said. Just that. My mind didn't break, but it bent. I ripped my hand free and stumbled inside the house, slamming the door behind me."
        },
        {
          id: "ch3",
          title: "Chapter 3: The Horror",
          contentMarkdown: `# The Horror

The laughter followed me immediately—high-pitched, low-pitched, layered, echoing like a crowd enjoying a private joke. And somewhere in the distance, the witches' drums fell completely silent.

Only then did I remember my mother wasn't with me.

Panic pushed me toward the window. If I couldn't go out, at least I could look.

I pulled the blind, but something soft was pressed against the glass from outside. Cloth? Skin? I couldn't tell. I pushed the window a little open and tugged at it.

It moved.

Then an enormous eyeball opened right in front of my face.

White, wet, wide.

I tried to scream, but my voice refused to come out.

Something gripped my ankle.

Hard.

Dry fingers, sharp-knuckled, gripping bone through flesh. Another hand clamped over my mouth, not warm—just stiff, as if it hadn't held life in decades.

The room stayed dark, but in that darkness, shapes shifted. Something crawled toward me on all fours, slow and crooked.

Her hair was the first thing I recognized.

Then her dress.

Then her face.

My mother—crawling into the glow from the window, her head twisted sharply backwards, her empty sockets staring at me, black and weeping.

My knees buckled.

The tall cat-creature stepped out behind her, holding a leash that dragged against the tiles.

Somewhere behind me, the calendar on the wall fluttered as the breeze passed. Reflex made me glance at it.

My hand trembled as I touched her photo.

The word "Late" under her name seemed brighter now, almost freshly printed.

Outside, three crows shot up into the air at once, scattering in different directions as if fleeing the thing now filling my house.

Everything inside me broke open at once.

And finally, I screamed.`,
          contentHtml: `<h1>The Horror</h1>
<p>The laughter followed me immediately—high-pitched, low-pitched, layered, echoing like a crowd enjoying a private joke. And somewhere in the distance, the witches' drums fell completely silent.</p>
<p>Only then did I remember my mother wasn't with me.</p>
<p>Panic pushed me toward the window. If I couldn't go out, at least I could look.</p>
<p>I pulled the blind, but something soft was pressed against the glass from outside. Cloth? Skin? I couldn't tell. I pushed the window a little open and tugged at it.</p>
<p>It moved.</p>
<p>Then an enormous eyeball opened right in front of my face.</p>
<p>White, wet, wide.</p>
<p>I tried to scream, but my voice refused to come out.</p>
<p>Something gripped my ankle.</p>
<p>Hard.</p>
<p>Dry fingers, sharp-knuckled, gripping bone through flesh. Another hand clamped over my mouth, not warm—just stiff, as if it hadn't held life in decades.</p>
<p>The room stayed dark, but in that darkness, shapes shifted. Something crawled toward me on all fours, slow and crooked.</p>
<p>Her hair was the first thing I recognized.</p>
<p>Then her dress.</p>
<p>Then her face.</p>
<p>My mother—crawling into the glow from the window, her head twisted sharply backwards, her empty sockets staring at me, black and weeping.</p>
<p>My knees buckled.</p>
<p>The tall cat-creature stepped out behind her, holding a leash that dragged against the tiles.</p>
<p>Somewhere behind me, the calendar on the wall fluttered as the breeze passed. Reflex made me glance at it.</p>
<p>My hand trembled as I touched her photo.</p>
<p>The word "Late" under her name seemed brighter now, almost freshly printed.</p>
<p>Outside, three crows shot up into the air at once, scattering in different directions as if fleeing the thing now filling my house.</p>
<p>Everything inside me broke open at once.</p>
<p>And finally, I screamed.</p>`,
          contentText: "The laughter followed me immediately—high-pitched, low-pitched, layered, echoing like a crowd enjoying a private joke. And somewhere in the distance, the witches' drums fell completely silent. Only then did I remember my mother wasn't with me. Panic pushed me toward the window. If I couldn't go out, at least I could look. I pulled the blind, but something soft was pressed against the glass from outside. Cloth? Skin? I couldn't tell. I pushed the window a little open and tugged at it. It moved. Then an enormous eyeball opened right in front of my face. White, wet, wide. I tried to scream, but my voice refused to come out. Something gripped my ankle. Hard. Dry fingers, sharp-knuckled, gripping bone through flesh. Another hand clamped over my mouth, not warm—just stiff, as if it hadn't held life in decades. The room stayed dark, but in that darkness, shapes shifted. Something crawled toward me on all fours, slow and crooked. Her hair was the first thing I recognized. Then her dress. Then her face. My mother—crawling into the glow from the window, her head twisted sharply backwards, her empty sockets staring at me, black and weeping. My knees buckled. The tall cat-creature stepped out behind her, holding a leash that dragged against the tiles. Somewhere behind me, the calendar on the wall fluttered as the breeze passed. Reflex made me glance at it. My hand trembled as I touched her photo. The word Late under her name seemed brighter now, almost freshly printed. Outside, three crows shot up into the air at once, scattering in different directions as if fleeing the thing now filling my house. Everything inside me broke open at once. And finally, I screamed."
        }
      ]
    }
  },
  {
    tokenId: 1007,
    title: "Bound by Honor",
    author: "0xSherahDaniels9876543210fedcba",
    tribe: "Thriller",
    language: "English",
    description: "A gripping tale of loyalty, betrayal, and the price of honor in a world where nothing is as it seems.",
    image: "/african-heritage-culture-art.jpg",
    category: "Thriller",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    metadata: {
      name: "Bound by Honor",
      summary: "I went out last night to turn on the pump. It was already 11 p.m., and my mother shook me awake because she wanted to take her bath. What started as a simple errand in the dark became a terrifying encounter with something beyond understanding.",
      expressionType: "Thriller",
      tags: ["mystery", "suspense", "thriller", "honor"],
      attributes: [
        { trait_type: "Expression Type", value: "Thriller" },
        { trait_type: "Genre", value: "mystery" },
        { trait_type: "Tags", value: "mystery,suspense,thriller,honor" }
      ],
      chapters: [
        {
          id: "ch1",
          title: "Chapter 1: The Awakening",
          contentMarkdown: `# The Awakening

I went out last night to turn on the pump.

It was already 11 p.m., and my mother shook me awake because she wanted to take her bath. I woke to the heavy heat of the room pressing against my skin, the type that made the walls feel closer than they actually were. My eyes burned from sleep, but she stood over me with that quiet urgency she gets sometimes.

Annoyance sat heavy in my chest—not loud, just hot, like the air itself. We were all suffering this heat. Why couldn't she wait?

I dragged myself out of bed, muttering under my breath, and slipped my feet into the nearest slippers. She promised to follow me, even apologized for waking me. It wasn't the apology that bothered me—it was how soft her voice sounded, almost fragile. Not like her.

But I pushed the thought away.

We stepped outside, and the night wrapped around us like wet cloth—dark, thick, humming with its own life. I flicked on my torch, its weak beam dancing across the ground and the bush behind our house. Our area had always been a place where strange things passed through—the crawling ones you could see, and the others you could only feel.

And always, at night, the witches played their drums in the distance.

Tonight, the silence was too clean.`,
          contentHtml: `<h1>The Awakening</h1>
<p>I went out last night to turn on the pump.</p>
<p>It was already 11 p.m., and my mother shook me awake because she wanted to take her bath. I woke to the heavy heat of the room pressing against my skin, the type that made the walls feel closer than they actually were. My eyes burned from sleep, but she stood over me with that quiet urgency she gets sometimes.</p>
<p>Annoyance sat heavy in my chest—not loud, just hot, like the air itself. We were all suffering this heat. Why couldn't she wait?</p>
<p>I dragged myself out of bed, muttering under my breath, and slipped my feet into the nearest slippers. She promised to follow me, even apologized for waking me. It wasn't the apology that bothered me—it was how soft her voice sounded, almost fragile. Not like her.</p>
<p>But I pushed the thought away.</p>
<p>We stepped outside, and the night wrapped around us like wet cloth—dark, thick, humming with its own life. I flicked on my torch, its weak beam dancing across the ground and the bush behind our house. Our area had always been a place where strange things passed through—the crawling ones you could see, and the others you could only feel.</p>
<p>And always, at night, the witches played their drums in the distance.</p>
<p>Tonight, the silence was too clean.</p>`,
          contentText: "I went out last night to turn on the pump. It was already 11 p.m., and my mother shook me awake because she wanted to take her bath. I woke to the heavy heat of the room pressing against my skin, the type that made the walls feel closer than they actually were. My eyes burned from sleep, but she stood over me with that quiet urgency she gets sometimes. Annoyance sat heavy in my chest—not loud, just hot, like the air itself. We were all suffering this heat. Why couldn't she wait? I dragged myself out of bed, muttering under my breath, and slipped my feet into the nearest slippers. She promised to follow me, even apologized for waking me. It wasn't the apology that bothered me—it was how soft her voice sounded, almost fragile. Not like her. But I pushed the thought away. We stepped outside, and the night wrapped around us like wet cloth—dark, thick, humming with its own life. I flicked on my torch, its weak beam dancing across the ground and the bush behind our house. Our area had always been a place where strange things passed through—the crawling ones you could see, and the others you could only feel. And always, at night, the witches played their drums in the distance. Tonight, the silence was too clean."
        },
        {
          id: "ch2",
          title: "Chapter 2: The Encounter",
          contentMarkdown: `# The Encounter

I walked slowly, feeling the gravel shift under my feet, checking over my shoulder every few steps to make sure my mother was still behind me. She kept close, but her breathing sounded… different. A little too calm.

We hadn't even reached the pump when something slipped across my leg.

Cold. Long. Smooth like a wet rope.

I didn't think—I just jumped back and ran.

My slippers slapped the ground loudly as I sprinted across the compound. My mother shouted my name, her voice cracking in a way I'd never heard, but fear pushed everything else to the edges of my mind.

By the time I reached the steps of the house, my heart was knocking so hard I could feel it in my throat. I slammed my hand against the wall to steady myself—

But the wall closed fingers around mine.

Human fingers.

Warm, firm, and deliberate.

My blood froze. The world narrowed to the slow turn of my head as I looked up.

A cat—as tall as a human, shoulders broad, eyes glowing yellow like lanterns—stood beside me. Its whiskers twitched, and its lips curled into something that wasn't quite a smile.

"Boo," it said.

Just that.

My mind didn't break, but it bent. I ripped my hand free and stumbled inside the house, slamming the door behind me.`,
          contentHtml: `<h1>The Encounter</h1>
<p>I walked slowly, feeling the gravel shift under my feet, checking over my shoulder every few steps to make sure my mother was still behind me. She kept close, but her breathing sounded… different. A little too calm.</p>
<p>We hadn't even reached the pump when something slipped across my leg.</p>
<p>Cold. Long. Smooth like a wet rope.</p>
<p>I didn't think—I just jumped back and ran.</p>
<p>My slippers slapped the ground loudly as I sprinted across the compound. My mother shouted my name, her voice cracking in a way I'd never heard, but fear pushed everything else to the edges of my mind.</p>
<p>By the time I reached the steps of the house, my heart was knocking so hard I could feel it in my throat. I slammed my hand against the wall to steady myself—</p>
<p>But the wall closed fingers around mine.</p>
<p>Human fingers.</p>
<p>Warm, firm, and deliberate.</p>
<p>My blood froze. The world narrowed to the slow turn of my head as I looked up.</p>
<p>A cat—as tall as a human, shoulders broad, eyes glowing yellow like lanterns—stood beside me. Its whiskers twitched, and its lips curled into something that wasn't quite a smile.</p>
<p>"Boo," it said.</p>
<p>Just that.</p>
<p>My mind didn't break, but it bent. I ripped my hand free and stumbled inside the house, slamming the door behind me.</p>`,
          contentText: "I walked slowly, feeling the gravel shift under my feet, checking over my shoulder every few steps to make sure my mother was still behind me. She kept close, but her breathing sounded… different. A little too calm. We hadn't even reached the pump when something slipped across my leg. Cold. Long. Smooth like a wet rope. I didn't think—I just jumped back and ran. My slippers slapped the ground loudly as I sprinted across the compound. My mother shouted my name, her voice cracking in a way I'd never heard, but fear pushed everything else to the edges of my mind. By the time I reached the steps of the house, my heart was knocking so hard I could feel it in my throat. I slammed my hand against the wall to steady myself— But the wall closed fingers around mine. Human fingers. Warm, firm, and deliberate. My blood froze. The world narrowed to the slow turn of my head as I looked up. A cat—as tall as a human, shoulders broad, eyes glowing yellow like lanterns—stood beside me. Its whiskers twitched, and its lips curled into something that wasn't quite a smile. Boo, it said. Just that. My mind didn't break, but it bent. I ripped my hand free and stumbled inside the house, slamming the door behind me."
        },
        {
          id: "ch3",
          title: "Chapter 3: The Revelation",
          contentMarkdown: `# The Revelation

The laughter followed me immediately—high-pitched, low-pitched, layered, echoing like a crowd enjoying a private joke. And somewhere in the distance, the witches' drums fell completely silent.

Only then did I remember my mother wasn't with me.

Panic pushed me toward the window. If I couldn't go out, at least I could look.

I pulled the blind, but something soft was pressed against the glass from outside. Cloth? Skin? I couldn't tell. I pushed the window a little open and tugged at it.

It moved.

Then an enormous eyeball opened right in front of my face.

White, wet, wide.

I tried to scream, but my voice refused to come out.

Something gripped my ankle.

Hard.

Dry fingers, sharp-knuckled, gripping bone through flesh. Another hand clamped over my mouth, not warm—just stiff, as if it hadn't held life in decades.

The room stayed dark, but in that darkness, shapes shifted. Something crawled toward me on all fours, slow and crooked.

Her hair was the first thing I recognized.

Then her dress.

Then her face.

My mother—crawling into the glow from the window, her head twisted sharply backwards, her empty sockets staring at me, black and weeping.

My knees buckled.

The tall cat-creature stepped out behind her, holding a leash that dragged against the tiles.

Somewhere behind me, the calendar on the wall fluttered as the breeze passed. Reflex made me glance at it.

My hand trembled as I touched her photo.

The word "Late" under her name seemed brighter now, almost freshly printed.

Outside, three crows shot up into the air at once, scattering in different directions as if fleeing the thing now filling my house.

Everything inside me broke open at once.

And finally, I screamed.`,
          contentHtml: `<h1>The Revelation</h1>
<p>The laughter followed me immediately—high-pitched, low-pitched, layered, echoing like a crowd enjoying a private joke. And somewhere in the distance, the witches' drums fell completely silent.</p>
<p>Only then did I remember my mother wasn't with me.</p>
<p>Panic pushed me toward the window. If I couldn't go out, at least I could look.</p>
<p>I pulled the blind, but something soft was pressed against the glass from outside. Cloth? Skin? I couldn't tell. I pushed the window a little open and tugged at it.</p>
<p>It moved.</p>
<p>Then an enormous eyeball opened right in front of my face.</p>
<p>White, wet, wide.</p>
<p>I tried to scream, but my voice refused to come out.</p>
<p>Something gripped my ankle.</p>
<p>Hard.</p>
<p>Dry fingers, sharp-knuckled, gripping bone through flesh. Another hand clamped over my mouth, not warm—just stiff, as if it hadn't held life in decades.</p>
<p>The room stayed dark, but in that darkness, shapes shifted. Something crawled toward me on all fours, slow and crooked.</p>
<p>Her hair was the first thing I recognized.</p>
<p>Then her dress.</p>
<p>Then her face.</p>
<p>My mother—crawling into the glow from the window, her head twisted sharply backwards, her empty sockets staring at me, black and weeping.</p>
<p>My knees buckled.</p>
<p>The tall cat-creature stepped out behind her, holding a leash that dragged against the tiles.</p>
<p>Somewhere behind me, the calendar on the wall fluttered as the breeze passed. Reflex made me glance at it.</p>
<p>My hand trembled as I touched her photo.</p>
<p>The word "Late" under her name seemed brighter now, almost freshly printed.</p>
<p>Outside, three crows shot up into the air at once, scattering in different directions as if fleeing the thing now filling my house.</p>
<p>Everything inside me broke open at once.</p>
<p>And finally, I screamed.</p>`,
          contentText: "The laughter followed me immediately—high-pitched, low-pitched, layered, echoing like a crowd enjoying a private joke. And somewhere in the distance, the witches' drums fell completely silent. Only then did I remember my mother wasn't with me. Panic pushed me toward the window. If I couldn't go out, at least I could look. I pulled the blind, but something soft was pressed against the glass from outside. Cloth? Skin? I couldn't tell. I pushed the window a little open and tugged at it. It moved. Then an enormous eyeball opened right in front of my face. White, wet, wide. I tried to scream, but my voice refused to come out. Something gripped my ankle. Hard. Dry fingers, sharp-knuckled, gripping bone through flesh. Another hand clamped over my mouth, not warm—just stiff, as if it hadn't held life in decades. The room stayed dark, but in that darkness, shapes shifted. Something crawled toward me on all fours, slow and crooked. Her hair was the first thing I recognized. Then her dress. Then her face. My mother—crawling into the glow from the window, her head twisted sharply backwards, her empty sockets staring at me, black and weeping. My knees buckled. The tall cat-creature stepped out behind her, holding a leash that dragged against the tiles. Somewhere behind me, the calendar on the wall fluttered as the breeze passed. Reflex made me glance at it. My hand trembled as I touched her photo. The word Late under her name seemed brighter now, almost freshly printed. Outside, three crows shot up into the air at once, scattering in different directions as if fleeing the thing now filling my house. Everything inside me broke open at once. And finally, I screamed."
        }
      ]
    }
  }
]

// Helper function to convert placeholder story to API Story format
export function placeholderToStory(placeholder: PlaceholderStory): any {
  return {
    id: placeholder.tokenId,
    tokenId: placeholder.tokenId,
    ipfsHash: `placeholder-${placeholder.tokenId}`,
    ipfsUrl: placeholder.image,
    author: placeholder.author,
    tribe: placeholder.tribe,
    language: placeholder.language,
    title: placeholder.title,
    description: placeholder.description,
    metadata: placeholder.metadata,
    createdAt: placeholder.createdAt,
    updatedAt: placeholder.createdAt
  }
}

