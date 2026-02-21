import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

// GET: Fetch all comments for a specific blog post
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const postSlug = searchParams.get('postSlug');

    if (!postSlug) {
      return NextResponse.json({ error: "postSlug is required" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("portfolio");
    
    const comments = await db.collection("comments")
      .find({ postSlug })
      .sort({ createdAt: -1 }) // Show newest comments first
      .toArray();
    
    return NextResponse.json(comments);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch comments" }, { status: 500 });
  }
}

// POST: Create a new comment
export async function POST(req: Request) {
  try {
    const { postSlug, text } = await req.json();
    
    if (!text || text.trim() === "") {
      return NextResponse.json({ error: "Comment text is required" }, { status: 400 });
    }
    
    // Assign a random animal identity to the user
    const animals = [
        { name: "Happy Ducky", icon: "🦆" },
        { name: "Playful Penguin", icon: "🐧" },
        { name: "Gentle Jumbo", icon: "🐘" },
        { name: "Clever Fox", icon: "🦊" },
        { name: "Cheerful Otter", icon: "🦦" },
        { name: "Cuddly Panda", icon: "🐼" },
        { name: "Sleepy Koala", icon: "🐨" },
        { name: "Brave Lion", icon: "🦁" },
        { name: "Fierce Tiger", icon: "🐯" },
        { name: "Spotted Leopard", icon: "🐆" },
        { name: "Swift Cheetah", icon: "🐆" },
        { name: "Loyal Wolf", icon: "🐺" },
        { name: "Friendly Dog", icon: "🐶" },
        { name: "Curious Cat", icon: "🐱" },
        { name: "Tiny Mouse", icon: "🐭" },
        { name: "Sneaky Rat", icon: "🐭" },
        { name: "Fluffy Hamster", icon: "🐹" },
        { name: "Bouncy Rabbit", icon: "🐰" },
        { name: "Strong Bear", icon: "🐻" },
        { name: "Chilly Polar Bear", icon: "🐻‍❄️" },
        { name: "Mischievous Monkey", icon: "🐵" },
        { name: "Mighty Gorilla", icon: "🦍" },
        { name: "Wise Orangutan", icon: "🦧" },
        { name: "Spotted Cow", icon: "🐮" },
        { name: "Jolly Pig", icon: "🐷" },
        { name: "Jumping Frog", icon: "🐸" },
        { name: "Clucky Chicken", icon: "🐔" },
        { name: "Proud Rooster", icon: "🐓" },
        { name: "Thankful Turkey", icon: "🦃" },
        { name: "Wise Owl", icon: "🦉" },
        { name: "Majestic Eagle", icon: "🦅" },
        { name: "Sharp Hawk", icon: "🦅" },
        { name: "Colorful Parrot", icon: "🦜" },
        { name: "Graceful Swan", icon: "🦢" },
        { name: "Elegant Flamingo", icon: "🦩" },
        { name: "Radiant Peacock", icon: "🦚" },
        { name: "Peaceful Dove", icon: "🕊️" },
        { name: "Nightly Bat", icon: "🦇" },
        { name: "Fearless Shark", icon: "🦈" },
        { name: "Gentle Whale", icon: "🐳" },
        { name: "Smart Dolphin", icon: "🐬" },
        { name: "Wiggly Octopus", icon: "🐙" },
        { name: "Speedy Squid", icon: "🦑" },
        { name: "Snappy Crab", icon: "🦀" },
        { name: "Clawed Lobster", icon: "🦞" },
        { name: "Tiny Shrimp", icon: "🦐" },
        { name: "Shiny Fish", icon: "🐟" },
        { name: "Puffy Blowfish", icon: "🐡" },
        { name: "Sunny Seal", icon: "🦭" },
        { name: "Sneaky Crocodile", icon: "🐊" },
        { name: "Slow Turtle", icon: "🐢" },
        { name: "Slithery Snake", icon: "🐍" },
        { name: "Scaly Lizard", icon: "🦎" },
        { name: "Terrific T-Rex", icon: "🦖" },
        { name: "Giant Sauropod", icon: "🦕" },
        { name: "Galloping Horse", icon: "🐴" },
        { name: "Magical Unicorn", icon: "🦄" },
        { name: "Striped Zebra", icon: "🦓" },
        { name: "Graceful Deer", icon: "🦌" },
        { name: "Massive Bison", icon: "🦬" },
        { name: "Wild Buffalo", icon: "🐃" },
        { name: "Sturdy Ox", icon: "🐂" },
        { name: "Climbing Goat", icon: "🐐" },
        { name: "Woolly Sheep", icon: "🐑" },
        { name: "Desert Camel", icon: "🐫" },
        { name: "Fluffy Llama", icon: "🦙" },
        { name: "Tall Giraffe", icon: "🦒" },
        { name: "Heavy Hippopotamus", icon: "🦛" },
        { name: "Horned Rhinoceros", icon: "🦏" },
        { name: "Hopping Kangaroo", icon: "🦘" },
        { name: "Lazy Sloth", icon: "🦥" },
        { name: "Stinky Skunk", icon: "🦨" },
        { name: "Crafty Raccoon", icon: "🦝" },
        { name: "Tough Badger", icon: "🦡" },
        { name: "Busy Beaver", icon: "🦫" },
        { name: "Spiky Hedgehog", icon: "🦔" },
        { name: "Quick Squirrel", icon: "🐿️" },
        { name: "Nimble Chipmunk", icon: "🐿️" },
        { name: "Hardworking Ant", icon: "🐜" },
        { name: "Buzzing Bee", icon: "🐝" },
        { name: "Lucky Ladybug", icon: "🐞" },
        { name: "Beautiful Butterfly", icon: "🦋" },
        { name: "Slimy Snail", icon: "🐌" },
        { name: "Wiggly Worm", icon: "🪱" },
        { name: "Deadly Scorpion", icon: "🦂" },
        { name: "Creepy Spider", icon: "🕷️" },
        { name: "Tiny Mosquito", icon: "🦟" },
        { name: "Annoying Fly", icon: "🪰" },
        { name: "Sneaky Cockroach", icon: "🪳" },
        { name: "Microscopic Microbe", icon: "🦠" },
        { name: "Soaring Turkey Vulture", icon: "🦅" },
        { name: "Diving Pelican", icon: "🦩" },
        { name: "Singing Canary", icon: "🐤" },
        { name: "Fluffy Chick", icon: "🐥" },
        { name: "Tiny Penguin Chick", icon: "🐧" },
        { name: "Charging Ram", icon: "🐏" },
        { name: "Stubborn Donkey", icon: "🫏" },
        { name: "Ancient Mammoth", icon: "🦣" },
        { name: "Extinct Dodo", icon: "🦤" },
        { name: "Laughing Hyena", icon: "🐺" },
        { name: "Spotted Jaguar", icon: "🐆" },
        { name: "Shadowy Panther", icon: "🐆" },
        { name: "Mountain Cougar", icon: "🐆" },
        { name: "Festive Reindeer", icon: "🦌" },
        { name: "Grand Moose", icon: "🦌" },
        { name: "Colorful Chameleon", icon: "🦎" },
        { name: "Sticky Gecko", icon: "🦎" },
        { name: "Green Iguana", icon: "🦎" },
        { name: "Mighty Komodo Dragon", icon: "🦎" },
        { name: "Swampy Alligator", icon: "🐊" },
        { name: "Sharp Barracuda", icon: "🐟" },
        { name: "Silver Salmon", icon: "🐟" },
        { name: "Speedy Tuna", icon: "🐟" },
        { name: "Tiny Seahorse", icon: "🐠" },
        { name: "Sparkly Starfish", icon: "⭐" },
        { name: "Floating Jellyfish", icon: "🎐" },
        { name: "Funny Clownfish", icon: "🐠" },
        { name: "Spiky Pufferfish", icon: "🐡" },
        { name: "Pecking Woodpecker", icon: "🦜" },
        { name: "Chattering Magpie", icon: "🦜" },
        { name: "Tiny Sparrow", icon: "🐦" },
        { name: "Clever Crow", icon: "🐦‍⬛" },
        { name: "Dark Raven", icon: "🐦‍⬛" },
        { name: "Tropical Toucan", icon: "🦜" },
        { name: "Bright Kingfisher", icon: "🐦" },
        { name: "Fast Falcon", icon: "🦅" },
        { name: "Noisy Seagull", icon: "🐦" },
        { name: "Odd Platypus", icon: "🦫" },
        { name: "Armored Armadillo", icon: "🦔" },
        { name: "Burrowing Wombat", icon: "🐻" },
        { name: "Wild Tasmanian Devil", icon: "🐻" },
        { name: "Alert Meerkat", icon: "🦡" },
        { name: "Chill Capybara", icon: "🐹" },
        { name: "Rare Okapi", icon: "🦒" },
        { name: "Shy Tapir", icon: "🦛" },
        { name: "Strong Yak", icon: "🐂" },
        { name: "Elegant Impala", icon: "🦌" },
        { name: "Swift Gazelle", icon: "🦌" },
        { name: "Graceful Antelope", icon: "🦌" },
        { name: "Hardy Mule", icon: "🐴" },
        { name: "Playful Ferret", icon: "🦦" },
        { name: "Sly Weasel", icon: "🦦" },
        { name: "Fearless Mongoose", icon: "🦦" },
        { name: "Prickly Porcupine", icon: "🦔" },
        { name: "Chunky Groundhog", icon: "🐹" },
        { name: "Soft Alpaca", icon: "🦙" },
        { name: "Gliding Condor", icon: "🦅" },
        { name: "Gentle Manatee", icon: "🦭" },
        { name: "Mystic Narwhal", icon: "🐳" },
        { name: "Powerful Orca", icon: "🐳" },
        { name: "Sharp Swordfish", icon: "🐟" },
        { name: "Bright Blue Jay", icon: "🐦" },
        { name: "Hungry Caterpillar", icon: "🐛" },
        { name: "Chirping Cricket", icon: "🦗" },
        { name: "Jumping Grasshopper", icon: "🦗" },
        { name: "Crawling Centipede", icon: "🐛" },
        { name: "Rolling Millipede", icon: "🐛" },
        { name: "Busy Termite", icon: "🐜" },
        { name: "Glowing Firefly", icon: "🐞" },
        { name: "Dancing Dragonfly", icon: "🦋" }
    ];
    const randomAnimal = animals[Math.floor(Math.random() * animals.length)];

    const client = await clientPromise;
    const db = client.db("portfolio");
    
    const newComment = {
      postSlug,
      text,
      animalIdentity: randomAnimal.name,
      animalIcon: randomAnimal.icon,
      createdAt: new Date()
    };

    await db.collection("comments").insertOne(newComment);
    
    return NextResponse.json({ success: true, comment: newComment });
  } catch (error) {
    return NextResponse.json({ error: "Failed to post comment" }, { status: 500 });
  }
}