import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Group as PanelGroup, 
  Panel, 
  Separator as PanelResizeHandle 
} from "react-resizable-panels";
import { 
  ArrowLeft, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  ChevronLeft,
  BookOpen,
  HelpCircle,
  Trophy,
  Workflow,
  ClipboardList,
  Library,
  ChevronRight,
  GripVertical,
  ArrowLeftRight,
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Markdown from "react-markdown";
import { recordAttempt } from "@/src/lib/progress";

type QuestionType = "mcq" | "tfn" | "ynng" | "completion" | "matching_headings" | "matching_info" | "matching_endings";

interface Question {
  id: number;
  type: QuestionType;
  question: string;
  options?: string[];
  endings?: { id: string; text: string }[];
  correctAnswer: string;
  explanation: string;
}

interface Passage {
  id: number;
  title: string;
  content: string;
  questions: Question[];
  difficulty: "Easy" | "Medium" | "Hard";
}

interface IELTSBook {
  id: number;
  title: string;
  type: "Academic" | "General";
  passages: Passage[];
  isComingSoon?: boolean;
}

const READING_LIBRARY: IELTSBook[] = [
  {
    id: 10,
    title: "IELTS 10",
    type: "Academic",
    passages: [
      {
        id: 1,
        title: "Stepwells",
        difficulty: "Medium",
        content: `**Stepwells**

A millennium ago, stepwells were fundamental to life in the driest parts of India. Although many have been neglected, recent restoration has returned them to their former glory. Richard Cox travelled to north-western India to document these spectacular monuments from a bygone era.

During the sixth and seventh centuries, the inhabitants of the modern-day states of Gujarat and Rajasthan in North-western India developed a method of gaining access to clean, fresh groundwater during the dry season for drinking, bathing, watering animals and irrigation. However, the significance of this invention – the stepwell – goes beyond its utilitarian application.

Unique to the region, stepwells are often architecturally complex and vary widely in size and shape. During their heyday, they were places of gathering, of leisure, of relaxation and of worship for villagers of all but the lowest castes. Most stepwells are found dotted around the desert areas of Gujarat (where they are called vav) and Rajasthan (where they are known as baori), while a few also survive in Delhi. Some were located in or near villages as public spaces for the community; others were positioned beside roads as resting places for travellers.

As their name suggests, stepwells comprise a series of stone steps descending from ground level to the water source (normally an underground aquifer) as it recedes following the rains. When the water level was high, the user needed only to descend a few steps to reach it; when it was low, several levels would have to be negotiated.

Some wells are vast, open craters with hundreds of steps paving each sloping side, often in tiers. Others are more elaborate, with long stepped passages leading to the water via several storeys. Built from stone and supported by pillars, they also included pavilions that sheltered visitors from the relentless heat. But perhaps the most impressive features are the intricate decorative sculptures that embellish many stepwells, showing activities from fighting and dancing to everyday acts such as women combing their hair and churning butter.

Down the centuries, thousands of wells were constructed throughout northwestern India, but the majority have now fallen into disuse; many are derelict and dry, as groundwater has been diverted for industrial use and the wells no longer reach the water table. Their condition hasn’t been helped by recent dry spells: southern Rajasthan suffered an eight-year drought between 1996 and 2004.

However, some important sites in Gujarat have recently undergone major restoration, and the state government announced in June last year that it plans to restore the stepwells throughout the state.

In Patan, the state’s ancient capital, the stepwell of Rani Ki Vav (Queen’s Stepwell) is perhaps the finest current example. It was built by Queen Udayamati during the late 11th century, but became silted up following a flood during the 13th century. But the Archaeological Survey of India began restoring it in the 1960s, and today it’s in pristine condition. At 65 metres long, 20 metres wide and 27 metres deep, Rani Ki Vav features 500 distinct sculptures carved into niches throughout the monument, depicting gods such as Vishnu and Parvati in various incarnations. Incredibly, in January 2001, this ancient structure survived a devastating earthquake that measured 7.6 on the Richter scale.

Another example is the Surya Kund in Modhera, northern Gujarat, next to the Sun Temple, built by King Bhima I in 1026 to honour the sun god Surya. It actually resembles a tank (kund means reservoir or pond) rather than a well, but displays the hallmarks of stepwell architecture, including four sides of steps that descend to the bottom in a stunning geometrical formation. The terraces house 108 small, intricately carved shrines between the sets of steps.

Rajasthan also has a wealth of wells. The ancient city of Bundi, 200 kilometres south of Jaipur, is renowned for its architecture, including its stepwells. One of the larger examples is Raniji Ki Baori, which was built by the queen of the region, Nathavatji, in 1699. At 46 metres deep, 20 metres wide and 40 metres long, the intricately carved monument is one of 21 baoris commissioned in the Bundi area by Nathavatji.

In the old ruined town of Abhaneri, about 95 kilometres east of Jaipur, is Chand Baori, one of India’s oldest and deepest wells; aesthetically, it’s perhaps one of the most dramatic. Built in around 850 AD next to the temple of Harshat Mata, the baori comprises hundreds of zigzagging steps that run along three of its sides, steeply descending 11 storeys, resulting in a striking geometric pattern when seen from afar. On the fourth side, verandas which are supported by ornate pillars overlook the steps.

Still in public use is Neemrana Ki Baori, located just off the Jaipur–Dehli highway. Constructed in around 1700, it’s nine storeys deep, with the last two being underwater. At ground level, there are 86 colonnaded openings from where the visitor descends 170 steps to the deepest water source.

Today, following years of neglect, many of these monuments to medieval engineering have been saved by the Archaeological Survey of India, which has recognised the importance of preserving them as part of the country’s rich history. Tourists flock to wells in far-flung corners of northwestern India to gaze in wonder at these architectural marvels from 1,000 years ago, which serve as a reminder of both the ingenuity and artistry of ancient civilisations and of the value of water to human existence.`,
        questions: [
          { id: 1, type: "tfn", question: "1. Examples of ancient stepwells can be found all over the world.", correctAnswer: "FALSE", explanation: "The text states they are 'Unique to the region' (Gujarat and Rajasthan in India)." },
          { id: 2, type: "tfn", question: "2. Stepwells had a range of functions, in addition to those related to water collection.", correctAnswer: "TRUE", explanation: "The text mentions they were places of gathering, leisure, relaxation and worship." },
          { id: 3, type: "tfn", question: "The few existing stepwells in Delhi are more attractive than those found elsewhere.", correctAnswer: "NOT GIVEN", explanation: "The text mentions some survive in Delhi, but doesn't compare their attractiveness to others." },
          { id: 4, type: "tfn", question: "It took workers many years to build the stone steps characteristic of stepwells.", correctAnswer: "NOT GIVEN", explanation: "The text doesn't mention how long it took to build the actual steps." },
          { id: 5, type: "tfn", question: "The number of steps above the water level in a stepwell altered during the course of a year.", correctAnswer: "TRUE", explanation: "The text says users descended a few steps when water was high and several levels when it was low following rains." },
          { id: 6, type: "completion", question: "Which part of some stepwells provided shade for people?", correctAnswer: "pavilions", explanation: "Paragraph 5 mentions 'pavilions that sheltered visitors from the relentless heat'." },
          { id: 7, type: "completion", question: "What type of serious climatic event, which took place in southern Rajasthan, is mentioned in the article?", correctAnswer: "drought", explanation: "Paragraph 6 mentions 'southern Rajasthan suffered an eight-year drought'." },
          { id: 8, type: "completion", question: "Who are frequent visitors to stepwells nowadays?", correctAnswer: "tourists", explanation: "Last paragraph mentions 'Tourists flock to wells'." },
          { id: 9, type: "completion", question: "Rani Ki Vav property Excellent condition, despite the ______ of 2001.", correctAnswer: "earthquake", explanation: "Paragraph 8 mentions it survived a devastating earthquake in 2001." },
          { id: 10, type: "completion", question: "Surya Kund Steps on the ______ produce a geometric pattern.", correctAnswer: "4/four sides", explanation: "Paragraph 9 mentions 'four sides of steps... in a stunning geometrical formation'." },
          { id: 11, type: "completion", question: "Surya Kund looks more like a ______ than a well.", correctAnswer: "tank", explanation: "Paragraph 9 says it 'actually resembles a tank'." },
          { id: 12, type: "completion", question: "Chand Baori has ______ which provide a view to the steps.", correctAnswer: "Verandas/ Verandahs", explanation: "Paragraph 11 mentions 'verandas which are supported by ornate pillars overlook the steps'." },
          { id: 13, type: "completion", question: "Neemrana Ki Baori has two ______ levels.", correctAnswer: "underwater", explanation: "Paragraph 12 mentions 'nine storeys deep, with the last two being underwater'." }
        ]
      },
      {
        id: 2,
        title: "European Transport Systems 1990-2010",
        difficulty: "Medium",
        content: `**European Transport Systems 1990-2010**
**What have been the trends and what are the prospects for European transport systems?**

**A**
It is difficult to conceive of vigorous economic growth without an efficient transport system. Although modern information technologies can reduce the demand for physical transport by facilitating teleworking and teleservices, the requirement for transport continues to increase. There are two key factors behind this trend. For passenger transport, the determining factor is the spectacular growth in car use. The number of cars on European Union (EU) roads saw an increase of three million cars each year from 1990 to 2010, and in the next decade the EU will see a further substantial increase in its fleet.

**B**
As far as goods transport is concerned, growth is due to a large extent to changes in the European economy and its system of production. In the last 20 years, as internal frontiers have been abolished, the EU has moved from a ‘stock’ economy to a ‘flow’ economy. This phenomenon has been emphasised by the relocation of some industries, particularly those which are labour intensive, to reduce production costs, even though the production site is hundreds or even thousands of kilometres away from the final assembly plant or away from users.

**C**
The strong economic growth expected in countries which are candidates for entry to the EU will also increase transport flows, in particular road haulage traffic. In 1998, some of these countries already exported more than twice their 1990 volumes and imported more than five times their 1990 volumes. And although many candidate countries inherited a transport system which encourages rail, the distribution between modes has tipped sharply in favour of road transport since the 1990s. Between 1990 and 1998, road haulage increased by 19.4%, while during the same period rail haulage decreased by 43.5%, although – and this could benefit the enlarged EU – it is still on average at a much higher level than in existing member states.

**D**
However, a new imperative-sustainable development – offers an opportunity for adapting the EU’s common transport policy. This objective, agreed by the Gothenburg European Council, has to be achieved by integrating environmental considerations into Community policies, and shifting the balance between modes of transport lies at the heart of its strategy. The ambitious objective can only be fully achieved by 2020, but proposed measures are nonetheless a first essential step towards a sustainable transport system which will ideally be in place in 30 years' time, that is by 2040.

**E**
In 1998, energy consumption in the transport sector was to blame for 28% of emissions of CO2, the leading greenhouse gas. According to the latest estimates, if nothing is done to reverse the traffic growth trend, CO2 emissions from transport can be expected to increase by around 50% to 1,113 billion tonnes by 2020, compared with the 739 billion tonnes recorded in 1990. Once again, road transport is the main culprit since it alone accounts for 84% of the CO2 emissions attributable to transport. Using alternative fuels and improving energy efficiency is thus both an ecological necessity and a technological challenge.

**F**
At the same time greater efforts must be made to achieve a modal shift. Such a change cannot be achieved overnight, all the less so after over half a century of constant deterioration in favour of road. This has reached such a pitch that today rail freight services are facing marginalisation, with just 8% of market share, and with international goods trains struggling along at an average speed of 18km/h. Three possible options have emerged.

**G**
The first approach would consist of focusing on road transport solely through pricing. This option would not be accompanied by complementary measures in the other modes of transport. In the short term it might curb the growth in road transport through the better loading ratio of goods vehicles and occupancy rates of passenger vehicles expected as a result of the increase in the price of transport. However, the lack of measures available to revitalise other modes of transport would make it impossible for more sustainable modes of transport to take up the baton.

**H**
The second approach also concentrates on road transport pricing but is accompanied by measures to increase the efficiency of the other modes (better quality of services, logistics, technology). However, this approach does not include investment in new infrastructure, nor does it guarantee better regional cohesion. It could help to achieve greater uncoupling than the first approach, but road transport would keep the lion’s share of the market and continue to concentrate on saturated arteries, despite being the most polluting of the modes. It is therefore not enough to guarantee the necessary shift of the balance.

**I**
The third approach, which is not new, comprises a series of measures ranging from pricing to revitalising alternative modes of transport and targeting investment in the trans-European network. This integrated approach would allow the market shares of the other modes to return to their 1998 levels and thus make a shift of balance. It is far more ambitious than it looks, bearing in mind the historical imbalance in favour of roads for the last fifty years, but would achieve a marked break in the link between road transport growth and economic growth, without placing restrictions on the mobility of people and goods.`,
        questions: [
          { id: 14, type: "matching_headings", question: "Paragraph A", correctAnswer: "viii", options: ["i", "ii", "iii", "iv", "v", "vi", "vii", "viii", "ix", "x", "xi"], explanation: "Paragraph A discusses the 'spectacular growth in car use', which relates to 'The rapid growth of private transport'." },
          { id: 15, type: "matching_headings", question: "Paragraph B", correctAnswer: "iii", options: ["i", "ii", "iii", "iv", "v", "vi", "vii", "viii", "ix", "x", "xi"], explanation: "Paragraph B mentions relocation of industries 'hundreds or even thousands of kilometres away', matching 'Changes affecting the distances goods may be transported'." },
          { id: 16, type: "matching_headings", question: "Paragraph C", correctAnswer: "xi", options: ["i", "ii", "iii", "iv", "v", "vi", "vii", "viii", "ix", "x", "xi"], explanation: "Paragraph C focuses on 'countries which are candidates for entry to the EU', corresponding to 'Transport trends in countries awaiting EU admission'." },
          { id: 17, type: "matching_headings", question: "Paragraph D", correctAnswer: "i", options: ["i", "ii", "iii", "iv", "v", "vi", "vii", "viii", "ix", "x", "xi"], explanation: "Paragraph D introduces 'sustainable development' as a 'new imperative' and a long-term goal for 2020-2040, matching 'A fresh and important long-term goal'." },
          { id: 18, type: "matching_headings", question: "Paragraph E", correctAnswer: "v", options: ["i", "ii", "iii", "iv", "v", "vi", "vii", "viii", "ix", "x", "xi"], explanation: "Paragraph E discusses CO2 emissions and energy consumption, which are 'environmental costs of road transport'." },
          { id: 19, type: "matching_headings", question: "Paragraph G", correctAnswer: "x", options: ["i", "ii", "iii", "iv", "v", "vi", "vii", "viii", "ix", "x", "xi"], explanation: "Paragraph G describes an approach focusing on 'road transport solely through pricing', matching 'Restricting road use through charging policies alone'." },
          { id: 20, type: "matching_headings", question: "Paragraph H", correctAnswer: "ii", options: ["i", "ii", "iii", "iv", "v", "vi", "vii", "viii", "ix", "x", "xi"], explanation: "Paragraph H mentions 'road transport pricing' accompanied by 'measures to revitalise the other modes', matching 'Charging for roads and improving other transport methods'." },
          { id: 21, type: "matching_headings", question: "Paragraph I", correctAnswer: "iv", options: ["i", "ii", "iii", "iv", "v", "vi", "vii", "viii", "ix", "x", "xi"], explanation: "Paragraph I covers a 'series of measures' to 'make a shift in the balance', matching 'Taking all the steps necessary to change transport patterns'." },
          { id: 22, type: "tfn", question: "The need for transport is growing, despite technological developments.", correctAnswer: "TRUE", explanation: "Paragraph A states: 'Although modern information technologies can reduce the demand... the requirement for transport continues to increase'." },
          { id: 23, type: "tfn", question: "To reduce production costs, some industries have been moved closer to their relevant consumers.", correctAnswer: "FALSE", explanation: "Paragraph B says industries were relocated 'even though the production site is hundreds or even thousands of kilometres away from... users'." },
          { id: 24, type: "tfn", question: "Cars are prohibitively expensive in some EU candidate countries.", correctAnswer: "NOT GIVEN", explanation: "The text mentions transport flows in candidate countries but does not mention the cost of cars." },
          { id: 25, type: "tfn", question: "The Gothenburg European Council was set up 30 years ago.", correctAnswer: "NOT GIVEN", explanation: "The text says the objective should be in place in 30 years' time (2040), but doesn't say when the council was set up." },
          { id: 26, type: "tfn", question: "By the end of this decade, CO2 emissions from transport are predicted to reach 739 billion tonnes.", correctAnswer: "FALSE", explanation: "739 billion tonnes was the level in 1990; the prediction for 2020 is 1,113 billion tonnes." }
        ]
      },
      {
        id: 3,
        title: "The psychology of innovation",
        difficulty: "Hard",
        content: `**The psychology of innovation**
**Why are so few companies truly innovative?**

Innovation is key to business survival, and companies put substantial resources into inspiring employees to develop new ideas. There are, nevertheless, people working in luxurious, state-of-the-art centres designed to stimulate innovation who find that their environment doesn’t make them feel at all creative. And there are those who don’t have a budget, or much space, but who innovate successfully.

For Robert B. Cialdini, Professor of Psychology at Arizona State University, one reason that companies don’t succeed as often as they should is that innovation starts with recruitment. Research shows that the fit between an employee’s values and a company’s values makes a difference to what contribution they make and whether, two years after they join, they’re still at the company. Studies at Harvard Business School show that, although some individuals may be more creative than others, almost every individual can be creative in the right circumstances.

One of the most famous photographs in the story of rock’n’roll emphasises Ciaidini’s views. The 1956 picture of singers Elvis Presley, Carl Perkins, Johnny Cash and Jerry Lee Lewis jamming at a piano in Sun Studios in Memphis tells a hidden story. Sun’s ‘million-dollar quartet’ could have been a quintet. Missing from the picture is Roy Orbison’ a greater natural singer than Lewis, Perkins or Cash. Sam Phillips, who owned Sun, wanted to revolutionise popular music with songs that fused black and white music, and country and blues. Presley, Cash, Perkins and Lewis instinctively understood Phillips’s ambition and believed in it. Orbison wasn’t inspired by the goal, and only ever achieved one hit with the Sun label.

The value fit matters, says Cialdini, because innovation is, in part, a process of change, and under that pressure we, as a species, behave differently, ‘When things change, we are hard-wired to play it safe.’ Managers should therefore adopt an approach that appears counterintuitive -they should explain what stands to be lost if the company fails to seize a particular opportunity. Studies show that we invariably take more gambles when threatened with a loss than when offered a reward.

Managing innovation is a delicate art. It’s easy for a company to be pulled in conflicting directions as the marketing, product development, and finance departments each get different feedback from different sets of people. And without a system which ensures collaborative exchanges within the company, it’s also easy for small ‘pockets of innovation’ to disappear. Innovation is a contact sport. You can’t brief people just by saying, ‘We’re going in this direction and I’m going to take you with me.’

Cialdini believes that this ‘follow-the-leader syndrome, is dangerous, not least because it encourages bosses to go it alone. ‘It’s been scientifically proven that three people will be better than one at solving problems, even if that one person is the smartest person in the field.’ To prove his point, Cialdini cites an interview with molecular biologist James Watson. Watson, together with Francis Crick, discovered the structure of DNA, the genetic information carrier of all living organisms. ‘When asked how they had cracked the code ahead of an array of highly accomplished rival investigators, he said something that stunned me. He said he and Crick had succeeded because they were aware that they weren’t the most intelligent of the scientists pursuing the answer. The smartest scientist was called Rosalind Franklin who, Watson said, “was so intelligent she rarely sought advice”.’

Teamwork taps into one of the basic drivers of human behaviour. ‘The principle of social proof is so pervasive that we don’t even recognise it,’ says Cialdini. ‘If your project is being resisted, for example, by a group of veteran employees, ask another old-timer to speak up for it.’ Cialdini is not alone in advocating this strategy. Research shows that peer power, used horizontally not vertically, is much more powerful than any boss’s speech.

Writing, visualising and prototyping can stimulate the flow of new ideas. Cialdini cites scores of research papers and historical events that prove that even something as simple as writing deepens every individual’s engagement in the project. It is, he says, the reason why all those competitions on breakfast cereal packets encouraged us to write in saying, in no more than 10 words: ‘I like Kellogg’s Com Flakes because… .’ The very act of writing makes us more likely to believe it.

Authority doesn’t have to inhibit innovation but it often does. The wrong kind of leadership will lead to what Cialdini calls ‘captainitis, the regrettable tendency of team members to opt out of team responsibilities that are properly theirs’. He calls it captainitis because, he says, ‘crew members of multipilot aircraft exhibit a sometimes deadly passivity when the flight captain makes a clearly wrong-headed decision’. This behaviour is not, he says, unique to air travel, but can happen in any workplace where the leader is overbearing.

At the other end of the scale is the 1980s Memphis design collective, a group of young designers for whom ‘the only rule was that there were no rules’. This environment encouraged a free interchange of ideas, which led to more creativity with form, function, colour and materials that revolutionised attitudes to furniture design.

Many theorists believe the ideal boss should lead from behind, taking pride in collective accomplishment and giving credit where it is due. Cialdini says: ‘Leaders should encourage everyone to contribute and simultaneously assure all concerned that every recommendation is important to making the right decision and will be given full attention.’ The frustrating thing about innovation is that there are many approaches, but no magic formula. However, a manager who wants to create a truly innovative culture can make their job a lot easier by recognising these psychological realities.`,
        questions: [
          { id: 27, type: "mcq", question: "The example of the ‘million-dollar quartet’ underlines the writer’s point about", options: ["recognising talent.", "working as a team.", "having a shared objective.", "being an effective leader."], correctAnswer: "C", explanation: "The text says Presley, Cash, Perkins and Lewis instinctively understood and believed in Phillips’s ambition, while Orbison wasn't inspired by the goal." },
          { id: 28, type: "mcq", question: "James Watson suggests that he and Francis Crick won the race to discover the DNA code because they", options: ["were conscious of their own limitations.", "brought complementary skills to their partnership.", "were determined to outperform their brighter rivals.", "encouraged each other to realise their joint ambition."], correctAnswer: "A", explanation: "Watson said they succeeded because they were aware that they weren’t the most intelligent; unlike Rosalind Franklin who rarely sought advice because she was so intelligent." },
          { id: 29, type: "mcq", question: "The writer mentions competitions on breakfast cereal packets as an example of how to", options: ["inspire creative thinking.", "generate concise writing.", "promote loyalty to a group.", "strengthen commitment to an idea."], correctAnswer: "D", explanation: "The text states: 'The very act of writing makes us more likely to believe it', strengthening engagement and commitment." },
          { id: 30, type: "mcq", question: "In the last paragraph, the writer suggests that it is important for employees to", options: ["be aware of their company’s goals.", "feel that their contributions are valued.", "have respect for their co-workers' achievements.", "understand why certain management decisions are made."], correctAnswer: "B", explanation: "The text says leaders should 'assure all concerned that every recommendation is important... and will be given full attention'." },
          { 
            id: 31, type: "matching_endings", question: "Employees whose values match those of their employers are more likely to", 
            endings: [
              { id: "A", text: "take chances." },
              { id: "B", text: "share their ideas." },
              { id: "C", text: "become competitive." },
              { id: "D", text: "get promotion." },
              { id: "E", text: "avoid risk." },
              { id: "F", text: "ignore their duties." },
              { id: "G", text: "remain in their jobs." }
            ],
            correctAnswer: "G", explanation: "Paragraph 2 mentions that the fit between employee and company values affects whether they are still at the company two years later." 
          },
          { id: 32, type: "matching_endings", question: "At times of change, people tend to", correctAnswer: "E", explanation: "Paragraph 4 states: 'When things change, we are hard-wired to play it safe' (avoid risk)." },
          { id: 33, type: "matching_endings", question: "If people are aware of what they might lose, they will often", correctAnswer: "A", explanation: "Paragraph 4 says studies show we invariably take more gambles (take chances) when threatened with a loss." },
          { id: 34, type: "matching_endings", question: "People working under a dominant boss are liable to", correctAnswer: "F", explanation: "Paragraph 9 describes 'captainitis' where team members opt out of responsibilities (ignore their duties) under overbearing leaders." },
          { id: 35, type: "matching_endings", question: "Employees working in organisations with few rules are more likely to", correctAnswer: "B", explanation: "Paragraph 10 mentions the Memphis design collective where 'no rules' encouraged a 'free interchange of ideas' (share their ideas)." },
          { id: 36, type: "ynng", question: "The physical surroundings in which a person works play a key role in determining their creativity.", correctAnswer: "NO", explanation: "Paragraph 1 mentions some people in state-of-the-art centres don't feel creative, while others with little space innovate successfully." },
          { id: 37, type: "ynng", question: "Most people have the potential to be creative.", correctAnswer: "YES", explanation: "Paragraph 2 states: 'almost every individual can be creative in the right circumstances'." },
          { id: 38, type: "ynng", question: "Teams work best when their members are of equally matched intelligence.", correctAnswer: "NOT GIVEN", explanation: "The text discusses team intelligence (3 people better than 1) but doesn't mention them needing to be 'equally matched'." },
          { id: 39, type: "ynng", question: "It is easier for smaller companies to be innovative.", correctAnswer: "NOT GIVEN", explanation: "The text doesn't explicitly compare company size to ease of innovation." },
          { id: 40, type: "ynng", question: "A manager’s approval of an idea is more persuasive than that of a colleague.", correctAnswer: "NO", explanation: "Paragraph 7 says research shows that 'peer power... is much more powerful than any boss’s speech'." }
        ]
      }
    ]
  },
  { id: 11, title: "IELTS 11", type: "Academic", isComingSoon: true, passages: [
    {
      id: 1,
      title: "Crop-growing Skyscrapers",
      difficulty: "Medium",
      content: `By the year 2050, nearly 80% of the Earth's population will live in urban centers. Applying the most conservative estimates to current demographic trends, the human population will increase by about three billion people by then. An estimated 109 hectares of new land will be needed to grow enough food to feed them, if traditional farming methods continue as they are practiced today. At present, throughout the world, over 80% of the land that is suitable for raising crops is in use.`,
      questions: [
        { id: 1, type: "completion", question: "By 2050, ______ percent of people will live in cities.", correctAnswer: "80", explanation: "Mentioned in the first sentence." }
      ]
    }
  ] },
  { id: 12, title: "IELTS 12", type: "Academic", isComingSoon: true, passages: [] },
  { id: 13, title: "IELTS 13", type: "Academic", isComingSoon: true, passages: [] },
  { id: 14, title: "IELTS 14", type: "Academic", isComingSoon: true, passages: [] },
  { id: 15, title: "IELTS 15", type: "Academic", isComingSoon: true, passages: [] },
  { id: 16, title: "IELTS 16", type: "Academic", isComingSoon: true, passages: [] },
  { id: 17, title: "IELTS 17", type: "Academic", isComingSoon: true, passages: [] },
  { id: 18, title: "IELTS 18", type: "Academic", isComingSoon: true, passages: [] },
  { id: 19, title: "IELTS 19", type: "Academic", isComingSoon: true, passages: [] },
  { id: 20, title: "IELTS 20", type: "Academic", isComingSoon: true, passages: [] },
  { id: 21, title: "IELTS 13 GT", type: "General", passages: [] },
  { id: 22, title: "IELTS 14 GT", type: "General", passages: [] }
];

export function ReadingModule({ onBack }: { onBack: () => void }) {
  const [examType, setExamType] = useState<"Academic" | "General">("Academic");
  const [selectedBook, setSelectedBook] = useState<IELTSBook | null>(null);
  const [testMode, setTestMode] = useState<"practice" | "exam" | null>(null);
  const [currentPassageIdx, setCurrentPassageIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [timeLeft, setTimeLeft] = useState(3600);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<{ score: number; band: number } | null>(null);
  const [draggedHeading, setDraggedHeading] = useState<string | null>(null);
  const [draggedEnding, setDraggedEnding] = useState<string | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (testMode === "exam" && !isSubmitting && selectedBook) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 0) {
            handleSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [testMode, isSubmitting, selectedBook]);

  const handleSubmit = () => {
    setIsSubmitting(true);
    const getBandScore = (correct: number) => {
      if (correct === 40) return 9.0;
      if (correct === 39) return 8.5;
      if (correct >= 37) return 8.0;
      if (correct === 36) return 7.5;
      if (correct >= 34) return 7.0;
      if (correct >= 32) return 6.5;
      if (correct >= 30) return 6.0;
      if (correct >= 27) return 5.5;
      if (correct >= 23) return 5.0;
      if (correct >= 19) return 4.5;
      if (correct >= 15) return 4.0;
      if (correct >= 12) return 3.5;
      if (correct >= 9) return 3.0;
      if (correct >= 6) return 2.5;
      return 1.0;
    };

    let correct = 0;
    selectedBook?.passages.forEach(p => {
      p.questions.forEach(q => {
        const userAnswer = (answers[q.id] || "").toLowerCase().trim();
        const correctAnswer = q.correctAnswer.toLowerCase().trim();
        
        // Flexible matching for slashed answers like "4/four sides"
        if (correctAnswer.includes('/')) {
          const parts = correctAnswer.split('/').map(p => p.trim());
          if (parts.some(p => userAnswer === p) || userAnswer === correctAnswer) {
            correct++;
          }
        } else if (userAnswer === correctAnswer) {
          correct++;
        }
      });
    });

    const band = getBandScore(correct);
    setResult({ score: correct, band });
    if (timerRef.current) clearInterval(timerRef.current);

    recordAttempt({
      module: "reading",
      band,
      label: selectedBook ? `${selectedBook.title} (${selectedBook.type})` : "Reading Test",
    });
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const currentPassage = selectedBook?.passages[currentPassageIdx];

  // 1. Library View
  if (!selectedBook) {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-6xl mx-auto space-y-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white transition-all"
              onClick={onBack}
            >
              <ArrowLeft className="w-6 h-6" />
            </Button>
            <div>
              <h2 className="text-3xl font-black text-white">Reading Module</h2>
              <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest">IELTS 10-20 Full Repository</p>
            </div>
          </div>
          <Tabs value={examType} onValueChange={(v) => setExamType(v as any)} className="w-full md:w-[400px]">
             <TabsList className="grid w-full grid-cols-2 bg-white/5 p-1 h-14 rounded-2xl border border-white/5">
                <TabsTrigger value="Academic" className="rounded-xl font-black uppercase tracking-widest text-[10px] data-[state=active]:bg-primary data-[state=active]:text-black">Academic</TabsTrigger>
                <TabsTrigger value="General" className="rounded-xl font-black uppercase tracking-widest text-[10px] data-[state=active]:bg-primary data-[state=active]:text-black">General Training</TabsTrigger>
             </TabsList>
          </Tabs>
        </div>

        {/* Hero Section */}
        <div className="text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold uppercase tracking-widest mb-4"
          >
            <Sparkles className="w-4 h-4" />
            AI Reading Laboratory
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-7xl font-extrabold tracking-tight text-white leading-[1.2] sm:leading-[1.1]"
          >
            Reading Mastery <br className="hidden sm:block" />
            <span className="text-indigo-400">&amp; Deep Comprehension.</span>
          </motion.h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 pb-20">
          {READING_LIBRARY.filter(b => b.type === examType).map((book) => (
            <Card 
              key={book.id} 
              className={`glass-card border-none bg-white/[0.03] p-8 text-center transition-all group relative overflow-hidden ${
                book.isComingSoon 
                  ? 'opacity-60 cursor-not-allowed grayscale' 
                  : 'cursor-pointer hover:bg-white/[0.08] hover:ring-2 hover:ring-primary/40'
              }`}
              onClick={() => {
                if (!book.isComingSoon) {
                  setSelectedBook(book);
                  setTestMode("exam");
                }
              }}
            >
              {book.isComingSoon && (
                <div className="absolute top-4 right-4 z-10">
                  <Badge variant="outline" className="bg-white/10 text-white border-white/20 font-black text-[8px] uppercase tracking-tighter">
                    Soon
                  </Badge>
                </div>
              )}
              <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:scale-110 transition-transform text-white">
                <Library className="w-24 h-24" />
              </div>
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <BookOpen className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-black text-white">{book.title}</h3>
              <p className="text-[10px] text-white/30 uppercase mt-2 font-black tracking-widest">
                {book.isComingSoon ? "Developing Content" : "Full Mock Test"}
              </p>
            </Card>
          ))}
        </div>
      </motion.div>
    );
  }

  // 3. Result Screen
  if (result) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-4xl mx-auto space-y-12 pb-20">
        <div className="text-center space-y-6 pt-10">
          <div className="w-24 h-24 rounded-full bg-emerald-500 flex items-center justify-center mx-auto shadow-2xl shadow-emerald-500/40">
            <Trophy className="w-12 h-12 text-white" />
          </div>
          <h2 className="text-5xl font-black text-white tracking-tighter uppercase">{selectedBook.title} Analysis</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           <Card className="glass-card border-none bg-white/5 p-12 text-center">
              <span className="text-[10px] font-black text-white/30 uppercase tracking-widest">Est. Band Score</span>
              <div className="text-8xl font-black text-emerald-400 tracking-tighter">{result.band}</div>
           </Card>
           <Card className="glass-card border-none bg-white/5 p-12 text-center">
              <span className="text-[10px] font-black text-white/30 uppercase tracking-widest">Raw Correct</span>
              <div className="text-8xl font-black text-indigo-400 tracking-tighter">{result.score}</div>
           </Card>
        </div>

        <Button className="w-full h-16 bg-white text-black font-black text-xl rounded-2xl" onClick={onBack}>Done Reviewing</Button>
      </motion.div>
    );
  }

  return (
    <div className="fixed top-20 inset-x-0 bottom-0 bg-[#050505] z-40 flex flex-col font-sans overflow-hidden">
      {/* Header (Fixed) */}
      <div className="h-16 border-b border-white/10 bg-[#0a0a0a] flex items-center justify-between px-6 shrink-0">
        <div className="flex items-center gap-4">
           <Button variant="ghost" size="icon" onClick={() => setSelectedBook(null)} className="text-white/40 hover:text-white transition-colors h-10 w-10"><ArrowLeft className="w-5 h-5"/></Button>
           <div className="flex flex-col">
              <span className="text-[10px] font-black text-white/40 uppercase tracking-widest leading-none">{selectedBook.title} Academic</span>
              <span className="text-base font-black text-white tracking-tight uppercase">Reading Module</span>
           </div>
           <div className="h-8 w-[1px] bg-white/10 mx-1" />
           <div className="flex items-center gap-2.5 bg-rose-500/10 px-4 py-1.5 rounded-xl border border-rose-500/20">
              <Clock className="w-4 h-4 text-rose-400" />
              <span className="text-lg font-mono font-black text-rose-400 tabular-nums">{formatTime(timeLeft)}</span>
           </div>
        </div>

        <div className="flex items-center gap-6">
           <div className="hidden sm:flex flex-col items-end">
              <span className="text-[10px] font-black text-white/30 uppercase tracking-widest leading-none">Progress</span>
              <span className="text-sm font-black text-white tabular-nums">{Object.keys(answers).length} / 40</span>
           </div>
           <Button className="bg-emerald-600 hover:bg-emerald-500 font-black px-8 h-11 rounded-xl shadow-lg shadow-emerald-500/20" onClick={handleSubmit}>SUBMIT TEST</Button>
        </div>
      </div>

      {/* Main Content (Resizable Split) */}
      <div className="flex-1 overflow-hidden">
        <PanelGroup orientation="horizontal" className="h-full w-full">
          {/* Passage Panel */}
          <Panel defaultSize={50} minSize={20}>
            <div className="h-full flex flex-col bg-[#080808]">
              <div className="h-12 bg-white/[0.02] border-b border-white/5 flex items-center px-8 shrink-0 justify-between">
                <span className="text-xs font-black text-primary uppercase tracking-[0.2em]">Passage {currentPassageIdx + 1}</span>
                <div className="flex gap-2">
                   <Button 
                    variant="ghost" 
                    size="sm" 
                    disabled={currentPassageIdx === 0}
                    onClick={() => setCurrentPassageIdx(prev => Math.max(0, prev - 1))}
                    className="h-8 w-8 p-0 rounded-lg text-white/40 hover:text-white"
                   >
                     <ChevronLeft className="w-4 h-4" />
                   </Button>
                   <Button 
                    variant="ghost" 
                    size="sm" 
                    disabled={currentPassageIdx === selectedBook.passages.length - 1}
                    onClick={() => setCurrentPassageIdx(prev => Math.min(selectedBook.passages.length - 1, prev + 1))}
                    className="h-8 w-8 p-0 rounded-lg text-white/40 hover:text-white"
                   >
                     <ChevronRight className="w-4 h-4" />
                   </Button>
                </div>
              </div>
              <ScrollArea className="flex-1">
                <div className="p-8 md:p-14 w-full space-y-12 pb-40 text-left">
                   {currentPassage ? (
                     <>
                       <h1 className="text-5xl font-black text-white tracking-tighter leading-tight uppercase">{currentPassage.title}</h1>
                       <div className="prose prose-invert prose-lg max-w-none text-slate-300 leading-relaxed font-medium selection:bg-primary/40 text-justify">
                         <Markdown
                            components={{
                              strong: ({ children, ...props }) => {
                                const text = children?.toString();
                                if (currentPassage.id === 2 && text?.length === 1 && /^[A-I]$/.test(text)) {
                                  const question = currentPassage.questions.find(q => q.question === `Paragraph ${text}`);
                                  if (question || text === 'F') {
                                    const isExample = text === 'F';
                                    const questionId = question?.id;
                                    const currentAnswer = questionId ? answers[questionId] : (isExample ? "vii" : null);

                                    return (
                                      <span className="mt-8 mb-4 space-y-4 block">
                                        <span 
                                          onDragOver={(e) => !isExample && e.preventDefault()}
                                          onDrop={(e) => {
                                            if (isExample) return;
                                            e.preventDefault();
                                            if (draggedHeading && questionId) {
                                              setAnswers(prev => ({ ...prev, [questionId]: draggedHeading }));
                                              setDraggedHeading(null);
                                            }
                                          }}
                                          className={`w-full h-16 border-2 border-dashed rounded-xl flex items-center px-6 transition-all group/drop ${
                                            isExample 
                                              ? 'border-white/5 bg-white/[0.01] opacity-50' 
                                              : (currentAnswer 
                                                ? 'border-primary/50 bg-primary/5' 
                                                : 'border-white/10 bg-white/[0.02] hover:border-primary/30 hover:bg-primary/5')
                                          }`}
                                        >
                                          <span className="flex items-center gap-4 w-full">
                                            <span className="w-8 h-8 rounded bg-white/10 flex items-center justify-center font-black text-xs text-white">
                                              {isExample ? "Ex" : questionId}
                                            </span>
                                            {currentAnswer ? (
                                              <span className="flex-1 flex items-center justify-between">
                                                <span className="font-black text-primary uppercase text-sm">{currentAnswer}</span>
                                                {!isExample && questionId && (
                                                  <button 
                                                    onClick={() => setAnswers(prev => {
                                                      const next = { ...prev };
                                                      delete next[questionId];
                                                      return next;
                                                    })}
                                                    className="text-[10px] uppercase font-black text-white/20 hover:text-rose-500 transition-colors"
                                                  >
                                                    Remove
                                                  </button>
                                                )}
                                              </span>
                                            ) : (
                                              <span className="text-white/20 font-black uppercase text-[10px] tracking-widest italic">Drop heading here</span>
                                            )}
                                          </span>
                                        </span>
                                        <strong {...props} className="block text-xl font-black text-white mt-4">{children}</strong>
                                      </span>
                                    );
                                  }
                                }
                                return <strong {...props}>{children}</strong>;
                              }
                            }}
                         >
                           {currentPassage.content}
                         </Markdown>
                       </div>
                     </>
                   ) : (
                     <div className="flex flex-col items-center justify-center py-40 text-center space-y-6 opacity-20">
                        <AlertCircle className="w-16 h-16" />
                        <p className="font-black uppercase tracking-[0.4em] text-sm text-white">Full Passage Content Not Loaded</p>
                     </div>
                   )}
                </div>
              </ScrollArea>
            </div>
          </Panel>

          <PanelResizeHandle className="w-2 bg-white/5 hover:bg-primary/20 transition-colors relative flex items-center justify-center group cursor-col-resize">
            <div className="w-5 h-5 bg-white border border-black flex items-center justify-center absolute z-50 shadow-sm">
              <ArrowLeftRight className="w-3.5 h-3.5 text-black stroke-[3]" />
            </div>
          </PanelResizeHandle>

          {/* Questions Panel */}
          <Panel defaultSize={50} minSize={20}>
            <div className="h-full flex flex-col bg-[#050505]">
              <div className="h-12 bg-white/[0.02] border-b border-white/5 flex items-center px-8 gap-6 overflow-x-auto shrink-0 scrollbar-hide">
                  <span className="text-xs font-black text-white/40 uppercase tracking-widest shrink-0">Navigation</span>
                  <div className="flex gap-1 py-1">
                    {Array.from({ length: 40 }).map((_, i) => (
                      <button 
                        key={i}
                        className={`w-6 h-6 rounded-md flex items-center justify-center text-[9px] font-black transition-all border shrink-0 ${
                          answers[i+1] 
                            ? 'bg-primary border-primary text-black' 
                            : 'bg-white/5 border-white/10 text-white/30 hover:border-white/40'
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>
              </div>
              <ScrollArea className="flex-1">
                <div className="p-8 md:p-12 w-full space-y-12 pb-60 text-left">
                    {currentPassage?.id === 1 && (
                      <div className="space-y-4">
                        <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Questions 1 - 5 </h3>
                        <div className="p-8 bg-white/[0.03] border border-white/5 rounded-3xl space-y-3">
                           <div className="flex items-center gap-3 text-indigo-400 font-black text-[10px] uppercase tracking-[0.2em]">
                              <HelpCircle className="w-4 h-4" /> Instructions
                           </div>
                           <p className="text-lg font-bold text-slate-300 gap-y-2 flex flex-col">
                             <span>Read the instructions carefully. Write your answers in the boxes or select the correct option.</span>
                             <span className="text-sm mt-2 flex flex-col gap-1 border-t border-white/5 pt-2">
                               <span className="text-emerald-400">TRUE &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;→ if the statement agrees with the information</span>
                               <span className="text-rose-400">FALSE &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;→ if the statement contradicts the information</span>
                               <span className="text-white/40">NOT GIVEN → if there is no information on this</span>
                             </span>
                           </p>
                        </div>
                      </div>
                    )}

                    <div className="space-y-16">
                      {/* Questions 1-5 (TRUE/FALSE/NOT GIVEN) */}
                      {currentPassage?.id === 1 && (
                        <div className="space-y-12">
                          {currentPassage?.questions.filter(q => q.id >= 1 && q.id <= 5).map((q) => (
                            <div key={q.id} className="space-y-6 group">
                              <div className="flex gap-4 items-start">
                                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-xl shrink-0 transition-all ${answers[q.id] ? 'bg-primary text-black' : 'bg-white/10 text-white/30'}`}>
                                    {q.id}
                                  </div>
                                  <p className="text-xl font-black text-white leading-tight pt-1 whitespace-pre-line">{q.question}</p>
                              </div>

                              <div className="ml-14 space-y-4">
                                  <RadioGroup 
                                    className="flex flex-col gap-2.5" 
                                    value={answers[q.id] || ""}
                                    onValueChange={(v) => setAnswers(prev => ({ ...prev, [q.id]: v }))}
                                  >
                                    {["TRUE", "FALSE", "NOT GIVEN"].map(opt => (
                                      <div key={opt} className={`flex items-center space-x-4 p-4 rounded-2xl border transition-all cursor-pointer ${answers[q.id] === opt ? 'bg-primary/10 border-primary' : 'bg-white/5 border-white/5 hover:bg-white/[0.08]'}`}>
                                        <RadioGroupItem value={opt} id={`q-${q.id}-${opt}`} className="border-white/20 w-5 h-5 shadow-none" />
                                        <Label htmlFor={`q-${q.id}-${opt}`} className="flex-1 font-black text-lg cursor-pointer text-white">{opt}</Label>
                                      </div>
                                    ))}
                                  </RadioGroup>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Questions 6-8 (Short Answer) */}
                      {currentPassage?.questions.some(q => q.id >= 6 && q.id <= 8) && (
                        <div className="space-y-12 border-t border-white/10 pt-16">
                          <div className="space-y-4">
                            <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Questions 6 - 8</h3>
                            <div className="p-8 bg-white/[0.03] border border-white/5 rounded-3xl space-y-3">
                               <div className="flex items-center gap-3 text-indigo-400 font-black text-[10px] uppercase tracking-[0.2em]">
                                  <HelpCircle className="w-4 h-4" /> Instructions
                               </div>
                               <div className="space-y-2 text-lg font-bold text-slate-300">
                                 <p>Answer the questions below.</p>
                                 <p>Choose <span className="text-white font-black">ONE WORD ONLY</span> from the passage for each answer.</p>
                                 <p className="text-sm text-white/40">Write your answers in boxes on your answer sheet.</p>
                               </div>
                            </div>
                          </div>

                          <div className="space-y-8">
                            {currentPassage.questions.filter(q => q.id >= 6 && q.id <= 8).map((q) => (
                              <div key={q.id} className="flex gap-6 items-center">
                                <div className={`w-8 h-8 rounded border-2 flex items-center justify-center font-black text-sm shrink-0 transition-all ${answers[q.id] ? 'bg-primary border-primary text-black' : 'border-white/20 text-white/40'}`}>
                                  {q.id}
                                </div>
                                <div className="flex-1 flex flex-wrap items-center gap-x-4 gap-y-3">
                                  <p className="text-lg font-black text-white leading-tight">{q.question}</p>
                                  <Input 
                                    className="h-10 bg-[#0a0a0a] border-white/20 rounded-md px-4 text-base font-black focus:ring-2 focus:ring-primary/20 text-white w-48 border transition-all"
                                    placeholder=""
                                    value={answers[q.id] || ""}
                                    onChange={(e) => setAnswers(prev => ({ ...prev, [q.id]: e.target.value }))}
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Questions 9-13 (Table Layout) */}
                      {currentPassage?.questions.some(q => q.id >= 9 && q.id <= 13) && (
                        <div className="space-y-12 border-t border-white/10 pt-16">
                          <div className="space-y-4">
                            <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Questions 9 - 13</h3>
                            <div className="p-8 bg-white/[0.03] border border-white/5 rounded-3xl space-y-3">
                               <div className="flex items-center gap-3 text-indigo-400 font-black text-[10px] uppercase tracking-[0.2em]">
                                  <HelpCircle className="w-4 h-4" /> Instructions
                               </div>
                               <div className="space-y-2 text-lg font-bold text-slate-300">
                                 <p>Complete the table below</p>
                                 <p>Choose <span className="text-white font-black">ONE WORD AND/OR A NUMBER</span> from the passage for each answer.</p>
                                 <p className="text-sm text-white/40">Write your answers in boxes on your answer sheet.</p>
                               </div>
                            </div>
                          </div>

                          <div className="overflow-x-auto rounded-xl border border-white/10 bg-white/[0.01]">
                            <table className="w-full text-left border-collapse min-w-[900px]">
                              <thead>
                                <tr className="border-b border-white/10 bg-white/5">
                                  <th className="p-4 text-xs font-black text-white uppercase tracking-widest border-r border-white/10 w-1/4">Stepwells</th>
                                  <th className="p-4 text-xs font-black text-white uppercase tracking-widest border-r border-white/10 w-1/6">Date</th>
                                  <th className="p-4 text-xs font-black text-white uppercase tracking-widest border-r border-white/10 w-1/4">Features</th>
                                  <th className="p-4 text-xs font-black text-white uppercase tracking-widest w-1/3">Other notes</th>
                                </tr>
                              </thead>
                              <tbody className="text-base text-slate-200">
                                {/* Rani Ki Vav Row */}
                                <tr className="border-b border-white/5">
                                  <td className="p-6 font-black text-white border-r border-white/10 align-top">Rani Ki Vav</td>
                                  <td className="p-6 border-r border-white/10 align-top">Late 11th century</td>
                                  <td className="p-6 border-r border-white/10 align-top">As many as 500 sculptures decorate the monument</td>
                                  <td className="p-6 space-y-4">
                                    <div className="font-bold">Restored in the 1990s</div>
                                    <div className="flex items-center gap-2 flex-wrap leading-relaxed">
                                      Excellent condition, despite the 
                                      <div className="flex items-center gap-1.5 shrink-0">
                                        <span className="w-8 h-8 rounded-md bg-white/10 border border-white/20 flex items-center justify-center font-black text-sm text-white">9</span>
                                        <Input 
                                          className="h-10 w-32 bg-[#0a0a0a] border-white/30 rounded-md px-3 text-base font-black text-white border focus:ring-2 focus:ring-primary/40" 
                                          value={answers[9] || ""}
                                          onChange={(e) => setAnswers(prev => ({ ...prev, 9: e.target.value }))}
                                        />
                                      </div>
                                      of 2001.
                                    </div>
                                  </td>
                                </tr>
                                {/* Surya Kund Row */}
                                <tr className="border-b border-white/5">
                                  <td className="p-6 font-black text-white border-r border-white/10 align-top">Surya Kund</td>
                                  <td className="p-6 border-r border-white/10 align-top">1026</td>
                                  <td className="p-6 border-r border-white/10 space-y-4 align-top">
                                    <div className="flex items-center gap-1.5 flex-wrap">
                                      Steps on the 
                                      <div className="flex items-center gap-1.5 shrink-0">
                                        <span className="w-8 h-8 rounded-md bg-white/10 border border-white/20 flex items-center justify-center font-black text-sm text-white">10</span>
                                        <Input 
                                          className="h-10 w-32 bg-[#0a0a0a] border-white/30 rounded-md px-3 text-base font-black text-white border focus:ring-2 focus:ring-primary/40" 
                                          value={answers[10] || ""}
                                          onChange={(e) => setAnswers(prev => ({ ...prev, 10: e.target.value }))}
                                        />
                                      </div>
                                      produce a geometric pattern
                                    </div>
                                    <div className="font-bold">Carved shrines.</div>
                                  </td>
                                  <td className="p-6 align-top">
                                    <div className="flex items-center gap-1.5 flex-wrap">
                                      Looks more like a 
                                      <div className="flex items-center gap-1.5 shrink-0">
                                        <span className="w-8 h-8 rounded-md bg-white/10 border border-white/20 flex items-center justify-center font-black text-sm text-white">11</span>
                                        <Input 
                                          className="h-10 w-32 bg-[#0a0a0a] border-white/30 rounded-md px-3 text-base font-black text-white border focus:ring-2 focus:ring-primary/40" 
                                          value={answers[11] || ""}
                                          onChange={(e) => setAnswers(prev => ({ ...prev, 11: e.target.value }))}
                                        />
                                      </div>
                                      than a well.
                                    </div>
                                  </td>
                                </tr>
                                {/* Raniji Ki Baori Row */}
                                <tr className="border-b border-white/5">
                                  <td className="p-6 font-black text-white border-r border-white/10 align-top">Raniji Ki Baori</td>
                                  <td className="p-6 border-r border-white/10 align-top">1699</td>
                                  <td className="p-6 border-r border-white/10 align-top">Intricately carved monument</td>
                                  <td className="p-6 align-top">One of 21 baoris in the area commissioned by Queen Nathavatji</td>
                                </tr>
                                {/* Chand Baori Row */}
                                <tr className="border-b border-white/5">
                                  <td className="p-6 font-black text-white border-r border-white/10 align-top">Chand Baori</td>
                                  <td className="p-6 border-r border-white/10 align-top">850 AD</td>
                                  <td className="p-6 border-r border-white/10 align-top">Steps take you down 11 storeys to the bottom</td>
                                  <td className="p-6 space-y-4 align-top">
                                    <div className="font-bold">Old, deep and very dramatic</div>
                                    <div className="flex items-center gap-1.5 flex-wrap">
                                      Has 
                                      <div className="flex items-center gap-1.5 shrink-0">
                                        <span className="w-8 h-8 rounded-md bg-white/10 border border-white/20 flex items-center justify-center font-black text-sm text-white">12</span>
                                        <Input 
                                          className="h-10 w-32 bg-[#0a0a0a] border-white/30 rounded-md px-3 text-base font-black text-white border focus:ring-2 focus:ring-primary/40" 
                                          value={answers[12] || ""}
                                          onChange={(e) => setAnswers(prev => ({ ...prev, 12: e.target.value }))}
                                        />
                                      </div>
                                      which provide a view to the steps.
                                    </div>
                                  </td>
                                </tr>
                                {/* Neemrana Ki Baori Row */}
                                <tr>
                                  <td className="p-6 font-black text-white border-r border-white/10 align-top">Neemrana Ki Baori</td>
                                  <td className="p-6 border-r border-white/10 align-top">1700</td>
                                  <td className="p-6 border-r border-white/10 align-top">
                                    <div className="flex items-center gap-1.5 flex-wrap">
                                      Has two 
                                      <div className="flex items-center gap-1.5 shrink-0">
                                        <span className="w-8 h-8 rounded-md bg-white/10 border border-white/20 flex items-center justify-center font-black text-sm text-white">13</span>
                                        <Input 
                                          className="h-10 w-32 bg-[#0a0a0a] border-white/30 rounded-md px-3 text-base font-black text-white border focus:ring-2 focus:ring-primary/40" 
                                          value={answers[13] || ""}
                                          onChange={(e) => setAnswers(prev => ({ ...prev, 13: e.target.value }))}
                                        />
                                      </div>
                                      levels.
                                    </div>
                                  </td>
                                  <td className="p-6 align-top font-bold text-white">Used by public today</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}

                      {/* Questions 14-21 (Matching Headings for Passage 2) */}
                      {currentPassage?.id === 2 && (
                        <div className="space-y-12 border-t border-white/10 pt-16">
                          <div className="space-y-4">
                            <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Questions 14 - 21</h3>
                            <div className="p-8 bg-white/[0.03] border border-white/5 rounded-3xl space-y-3">
                               <div className="flex items-center gap-3 text-indigo-400 font-black text-[10px] uppercase tracking-[0.2em]">
                                  <HelpCircle className="w-4 h-4" /> Instructions
                               </div>
                               <div className="space-y-2 text-lg font-bold text-slate-300">
                                 <p>Reading Passage 2 has nine paragraphs, <b>A-I</b>.</p>
                                 <p>Choose the correct heading for paragraphs <b>A-E</b> and <b>G-I</b> from the list of headings below.</p>
                                 <p className="text-sm text-white/40 italic">Drag and drop the headings to the correct paragraphs in the passage.</p>
                               </div>
                            </div>
                          </div>

                          <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-8 space-y-8">
                            <div className="flex items-center justify-between">
                              <h4 className="text-white font-black uppercase tracking-[0.3em] text-xs">List of Headings</h4>
                              <div className="flex gap-4 items-center px-4 py-2 bg-primary/10 border border-primary/20 rounded-xl">
                                <div className="w-6 h-6 rounded bg-primary flex items-center justify-center font-black text-black text-[10px]">Ex</div>
                                <p className="text-[10px] text-primary font-black uppercase tracking-tight">Example: Paragraph F — vii</p>
                              </div>
                            </div>

                            <div className="space-y-3">
                              {[
                                { id: "i", text: "A fresh and important long-term goal" },
                                { id: "ii", text: "Charging for roads and improving other transport methods" },
                                { id: "iii", text: "Changes affecting the distances goods may be transported" },
                                { id: "iv", text: "Taking all the steps necessary to change transport patterns" },
                                { id: "v", text: "The environmental costs of road transport" },
                                { id: "vi", text: "The escalating cost of rail transport" },
                                { id: "vii", text: "The need to achieve transport rebalance" },
                                { id: "viii", text: "The rapid growth of private transport" },
                                { id: "ix", text: "Plans to develop major road networks" },
                                { id: "x", text: "Restricting road use through charging policies alone" },
                                { id: "xi", text: "Transport trends in countries awaiting EU admission" }
                              ].map((heading) => {
                                const isUsed = Object.values(answers).includes(heading.id) || heading.id === "vii";
                                return (
                                  <div 
                                    key={heading.id}
                                    draggable={!isUsed}
                                    onDragStart={() => setDraggedHeading(heading.id)}
                                    onDragEnd={() => setDraggedHeading(null)}
                                    className={`flex gap-4 items-center p-4 rounded-xl border-2 transition-all cursor-grab active:cursor-grabbing ${
                                      isUsed 
                                        ? 'opacity-30 border-white/5 bg-white/[0.01] pointer-events-none' 
                                        : 'bg-white/5 border-white/10 hover:border-primary/50 hover:bg-primary/5 group'
                                    }`}
                                  >
                                    <div className="w-2 h-2 rounded-full bg-white/20 group-hover:bg-primary transition-colors" />
                                    <span className="font-bold text-white shrink-0 w-8">{heading.id}.</span>
                                    <span className="text-sm text-slate-300 group-hover:text-white transition-colors">{heading.text}</span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Questions 22-26 (TFN for Passage 2) */}
                      {currentPassage?.id === 2 && (
                         <div className="space-y-12 border-t border-white/10 pt-16">
                            <div className="space-y-4">
                              <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Questions 22 - 26</h3>
                              <div className="p-8 bg-white/[0.03] border border-white/5 rounded-3xl space-y-3">
                                 <div className="flex items-center gap-3 text-indigo-400 font-black text-[10px] uppercase tracking-[0.2em]">
                                    <HelpCircle className="w-4 h-4" /> Instructions
                                 </div>
                                 <div className="space-y-2 text-lg font-bold text-slate-300">
                                   <p>Do the following statements agree with the information given in the Reading Passage?</p>
                                   <div className="text-sm mt-4 flex flex-col gap-1 border-t border-white/5 pt-4">
                                      <span className="text-emerald-400 font-black uppercase">TRUE &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;→ if the statement agrees with the information</span>
                                      <span className="text-rose-400 font-black uppercase">FALSE &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;→ if the statement contradicts the information</span>
                                      <span className="text-white/40 font-black uppercase">NOT GIVEN → if there is no information on this</span>
                                   </div>
                                 </div>
                              </div>
                            </div>

                            <div className="space-y-12">
                              {currentPassage.questions.filter(q => q.type === "tfn").map((q) => (
                                <div key={q.id} className="space-y-6 group">
                                  <div className="flex gap-4 items-start">
                                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-xl shrink-0 transition-all ${answers[q.id] ? 'bg-primary text-black' : 'bg-white/10 text-white/30'}`}>
                                        {q.id}
                                      </div>
                                      <p className="text-xl font-black text-white leading-tight pt-1 whitespace-pre-line">{q.question}</p>
                                  </div>

                                  <div className="ml-14 space-y-4">
                                      <RadioGroup 
                                        className="flex flex-col gap-2.5" 
                                        value={answers[q.id] || ""}
                                        onValueChange={(v) => setAnswers(prev => ({ ...prev, [q.id]: v }))}
                                      >
                                        {["TRUE", "FALSE", "NOT GIVEN"].map(opt => (
                                          <div key={opt} className={`flex items-center space-x-4 p-4 rounded-2xl border transition-all cursor-pointer ${answers[q.id] === opt ? 'bg-primary/10 border-primary' : 'bg-white/5 border-white/5 hover:bg-white/[0.08]'}`}>
                                            <RadioGroupItem value={opt} id={`q-${q.id}-${opt}`} className="border-white/20 w-5 h-5 shadow-none" />
                                            <Label htmlFor={`q-${q.id}-${opt}`} className="flex-1 font-black text-lg cursor-pointer text-white">{opt}</Label>
                                          </div>
                                        ))}
                                      </RadioGroup>
                                  </div>
                                </div>
                              ))}
                            </div>
                         </div>
                      )}

                      {/* Passage 3 Questions (27-40) */}
                      {currentPassage?.id === 3 && (
                        <div className="space-y-16 mt-8">
                          {/* MCQ (27-30) */}
                          <div className="space-y-12">
                            <div className="space-y-4">
                              <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Questions 27 - 30</h3>
                              <div className="p-8 bg-white/[0.03] border border-white/5 rounded-3xl space-y-3">
                                <div className="flex items-center gap-3 text-indigo-400 font-black text-[10px] uppercase tracking-[0.2em]">
                                  <HelpCircle className="w-4 h-4" /> Instructions
                                </div>
                                <p className="text-lg font-bold text-slate-300">
                                  Choose the correct letter, <b>A</b>, <b>B</b>, <b>C</b> or <b>D</b>.
                                </p>
                              </div>
                            </div>

                            <div className="space-y-16">
                              {currentPassage.questions.filter(q => q.type === "mcq").map((q) => (
                                <div key={q.id} className="space-y-8">
                                  <div className="flex gap-4 items-start">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-xl shrink-0 transition-all ${answers[q.id] ? 'bg-primary text-black' : 'bg-white/10 text-white/30'}`}>
                                      {q.id}
                                    </div>
                                    <p className="text-xl font-black text-white leading-tight pt-1">{q.question}</p>
                                  </div>

                                  <div className="ml-14 space-y-3">
                                    <RadioGroup 
                                      className="grid gap-3" 
                                      value={answers[q.id] || ""}
                                      onValueChange={(v) => setAnswers(prev => ({ ...prev, [q.id]: v }))}
                                    >
                                      {q.options?.map((option, idx) => {
                                        const letter = String.fromCharCode(65 + idx);
                                        const isSelected = answers[q.id] === letter;
                                        return (
                                          <div key={idx} className={`flex items-center space-x-4 p-5 rounded-2xl border transition-all cursor-pointer ${isSelected ? 'bg-primary/10 border-primary shadow-[0_0_20px_rgba(var(--primary-rgb),0.1)]' : 'bg-white/5 border-white/5 hover:bg-white/[0.08]'}`}>
                                            <RadioGroupItem value={letter} id={`q-${q.id}-${letter}`} className="border-white/20 w-6 h-6 shadow-none" />
                                            <Label htmlFor={`q-${q.id}-${letter}`} className="flex-1 cursor-pointer flex gap-4 items-center">
                                              <span className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-sm shrink-0 ${isSelected ? 'bg-primary text-black' : 'bg-white/10 text-white/40'}`}>
                                                {letter}
                                              </span>
                                              <span className="font-bold text-lg text-white leading-tight">{option}</span>
                                            </Label>
                                          </div>
                                        );
                                      })}
                                    </RadioGroup>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Matching Endings (31-35) */}
                          <div className="space-y-12 border-t border-white/10 pt-16">
                            <div className="space-y-4">
                              <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Questions 31 - 35</h3>
                              <div className="p-8 bg-white/[0.03] border border-white/5 rounded-3xl space-y-3">
                                <div className="flex items-center gap-3 text-indigo-400 font-black text-[10px] uppercase tracking-[0.2em]">
                                  <HelpCircle className="w-4 h-4" /> Instructions
                                </div>
                                <div className="space-y-2 text-lg font-bold text-slate-300">
                                  <p>Complete each sentence with the correct ending, <b>A-G</b>, below.</p>
                                  <p className="text-sm text-white/40 italic">Write the correct letter, <b>A-G</b>, in boxes on your answer sheet</p>
                                </div>
                              </div>
                            </div>

                            {/* Sentence List with Drop Targets */}
                            <div className="space-y-8">
                              {currentPassage.questions.filter(q => q.type === "matching_endings").map((q) => (
                                <div key={q.id} className="flex items-start gap-4 group">
                                  <span className="text-white/40 group-hover:text-primary transition-colors text-xl mt-1">•</span>
                                  <div className="flex-1 flex flex-wrap items-center gap-x-3 gap-y-4">
                                    <p className="text-xl font-bold text-slate-200 leading-tight">
                                      {q.question}
                                    </p>
                                    <div 
                                      onDragOver={(e) => e.preventDefault()}
                                      onDrop={(e) => {
                                        e.preventDefault();
                                        if (draggedEnding) {
                                          setAnswers(prev => ({ ...prev, [q.id]: draggedEnding }));
                                          setDraggedEnding(null);
                                        }
                                      }}
                                      className={`min-w-[140px] h-12 border-2 border-dashed rounded-xl flex items-center px-4 transition-all relative ${
                                        answers[q.id] 
                                          ? 'border-primary/50 bg-primary/5' 
                                          : 'border-white/20 bg-white/[0.02] hover:border-primary/30'
                                      }`}
                                    >
                                      <div className="absolute -left-6 top-1/2 -translate-y-1/2 w-8 h-8 rounded bg-white/10 border border-white/10 flex items-center justify-center font-black text-xs text-white">
                                        {q.id}
                                      </div>
                                      {answers[q.id] ? (
                                        <div className="flex justify-between items-center w-full">
                                          <span className="font-black text-primary text-xl">{answers[q.id]}</span>
                                          <button 
                                            onClick={() => setAnswers(prev => {
                                              const next = { ...prev };
                                              delete next[q.id];
                                              return next;
                                            })}
                                            className="text-[10px] font-black text-white/20 hover:text-rose-500 transition-colors uppercase"
                                          >
                                            Remove
                                          </button>
                                        </div>
                                      ) : (
                                        <span className="text-white/20 font-black italic text-[10px] uppercase tracking-widest">Drop answer here</span>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>

                            {/* Options List to Drag From */}
                            <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-8 space-y-6">
                              <div className="flex items-center gap-3 text-white/40 font-black text-[10px] uppercase tracking-[0.2em] italic">
                                <HelpCircle className="w-4 h-4" /> Drag and drop an option to fill in each blank
                              </div>
                              <div className="grid gap-3">
                                {[
                                  { id: "A", text: "take chances." },
                                  { id: "B", text: "share their ideas." },
                                  { id: "C", text: "become competitive." },
                                  { id: "D", text: "get promotion." },
                                  { id: "E", text: "avoid risk." },
                                  { id: "F", text: "ignore their duties." },
                                  { id: "G", text: "remain in their jobs." }
                                ].map((option) => {
                                  const isUsed = Object.values(answers).includes(option.id);
                                  return (
                                    <div 
                                      key={option.id}
                                      draggable={!isUsed}
                                      onDragStart={() => setDraggedEnding(option.id)}
                                      onDragEnd={() => setDraggedEnding(null)}
                                      className={`flex gap-4 items-center p-4 rounded-xl border-2 transition-all cursor-grab active:cursor-grabbing ${
                                        isUsed 
                                          ? 'opacity-30 border-white/5 bg-white/[0.01] pointer-events-none' 
                                          : 'bg-white/5 border-white/10 hover:border-primary/50 hover:bg-primary/5 group'
                                      }`}
                                    >
                                      <span className="font-bold text-white shrink-0 w-6">{option.id}.</span>
                                      <span className="text-sm font-bold text-slate-300 group-hover:text-white transition-colors">{option.text}</span>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          </div>

                          {/* YNNG (36-40) */}
                          <div className="space-y-12 border-t border-white/10 pt-16">
                            <div className="space-y-4">
                              <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Questions 36 - 40</h3>
                              <div className="p-8 bg-white/[0.03] border border-white/5 rounded-3xl space-y-3">
                                <div className="flex items-center gap-3 text-indigo-400 font-black text-[10px] uppercase tracking-[0.2em]">
                                  <HelpCircle className="w-4 h-4" /> Instructions
                                </div>
                                <div className="space-y-2 text-lg font-bold text-slate-300">
                                  <p>Do the following statements agree with the claims of the writer in the Reading Passage?</p>
                                  <div className="text-sm mt-4 flex flex-col gap-1 border-t border-white/5 pt-4">
                                    <span className="text-emerald-400 font-black uppercase font-mono">YES &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;→ if the statement agrees with the claims of the writer</span>
                                    <span className="text-rose-400 font-black uppercase font-mono">NO &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;→ if the statement contradicts the claims of the writer</span>
                                    <span className="text-white/40 font-black uppercase font-mono">NOT GIVEN → if it is impossible to say what the writer thinks about this</span>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="space-y-12">
                              {currentPassage.questions.filter(q => q.type === "ynng").map((q) => (
                                <div key={q.id} className="space-y-6">
                                  <div className="flex gap-4 items-start">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-xl shrink-0 transition-all ${answers[q.id] ? 'bg-primary text-black' : 'bg-white/10 text-white/30'}`}>
                                      {q.id}
                                    </div>
                                    <p className="text-xl font-black text-white leading-tight pt-1">{q.question}</p>
                                  </div>

                                  <div className="ml-14 space-y-3">
                                    <RadioGroup 
                                      className="flex flex-col gap-2.5" 
                                      value={answers[q.id] || ""}
                                      onValueChange={(v) => setAnswers(prev => ({ ...prev, [q.id]: v }))}
                                    >
                                      {["YES", "NO", "NOT GIVEN"].map((val) => (
                                        <div key={val} className={`flex items-center space-x-4 p-4 rounded-2xl border transition-all cursor-pointer ${answers[q.id] === val ? 'bg-primary/10 border-primary shadow-[0_0_20px_rgba(var(--primary-rgb),0.1)]' : 'bg-white/5 border-white/5 hover:bg-white/[0.08]'}`}>
                                          <RadioGroupItem value={val} id={`q-${q.id}-${val}`} className="border-white/20 w-5 h-5 shadow-none" />
                                          <Label htmlFor={`q-${q.id}-${val}`} className="flex-1 font-black text-lg cursor-pointer text-white tracking-[0.05em]">{val}</Label>
                                        </div>
                                      ))}
                                    </RadioGroup>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {!currentPassage && (
                      <div className="text-center py-20 bg-white/[0.02] rounded-3xl border-2 border-dashed border-white/5 flex flex-col items-center gap-6">
                         <HelpCircle className="w-12 h-12 text-white/5" />
                         <span className="text-white/20 font-black uppercase tracking-[0.2em] text-xs">Loading Section...</span>
                      </div>
                    )}
                </div>

              </ScrollArea>
            </div>
          </Panel>
        </PanelGroup>
      </div>
    </div>
  );
}

export default ReadingModule;
