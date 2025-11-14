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

