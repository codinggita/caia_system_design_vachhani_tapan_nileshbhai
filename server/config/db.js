const mongoose = require('mongoose');
const Concept = require('../models/Concept');

const seedConcepts = async () => {
  try {
    // Migrate any existing 'easy' difficulty documents to 'beginner'
    const migratedRoot = await Concept.updateMany(
      { difficulty: 'easy' },
      { $set: { difficulty: 'beginner' } }
    );
    const migratedMeta = await Concept.updateMany(
      { 'metadata.difficulty': 'easy' },
      { $set: { 'metadata.difficulty': 'beginner' } }
    );
    if (migratedRoot.modifiedCount > 0 || migratedMeta.modifiedCount > 0) {
      console.log(`🔄 Migrated ${migratedRoot.modifiedCount + migratedMeta.modifiedCount} 'easy' difficulty concepts to 'beginner'.`);
    }

    const expertCount = await Concept.countDocuments({
      $or: [{ difficulty: 'expert' }, { 'metadata.difficulty': 'expert' }]
    });
    const count = await Concept.countDocuments();

    if (count === 0 || expertCount === 0) {
      console.log('🌱 Checking for missing difficulty concepts to seed...');
      const seedData = [];

      const hasBeginner = await Concept.findOne({ title: "Load Balancers (Layer 4 vs Layer 7)" });
      if (!hasBeginner) {
        seedData.push({
          title: "Load Balancers (Layer 4 vs Layer 7)",
          prompt: "Explain the difference between L4 and L7 Load Balancing.",
          response: "# Load Balancing\n\nL4 Load Balancing works at the transport layer, routing TCP/UDP packets. L7 Load Balancing operates at the application layer, routing HTTP/HTTPS requests based on URL, headers, or cookies.",
          category: "Foundations",
          subcategory: "Networking",
          difficulty: "beginner",
          questionType: "theory",
          tags: ["load-balancing", "networking"]
        });
      }

      const hasDNS = await Concept.findOne({ title: "DNS Query Routing and Name Resolution" });
      if (!hasDNS) {
        seedData.push({
          title: "DNS Query Routing and Name Resolution",
          prompt: "Explain how DNS translates domain names to IP addresses.",
          response: "# DNS Resolution\n\nDomain Name System (DNS) maps human-readable names to IP addresses.\n1. Recursive Resolver\n2. Root Nameserver\n3. TLD Nameserver\n4. Authoritative Nameserver",
          category: "Foundations",
          subcategory: "Networking",
          difficulty: "beginner",
          questionType: "theory",
          tags: ["dns", "networking"]
        });
      }

      const hasIntermediate = await Concept.findOne({ title: "Message Queues (RabbitMQ vs Kafka)" });
      if (!hasIntermediate) {
        seedData.push({
          title: "Message Queues (RabbitMQ vs Kafka)",
          prompt: "When should we use RabbitMQ vs Kafka?",
          response: "# Messaging Patterns\n\nUse RabbitMQ for complex routing and transactional message delivery. Use Apache Kafka for high-throughput stream processing, log aggregation, and event-sourcing architectures.",
          category: "Scalability",
          subcategory: "Event-Driven",
          difficulty: "intermediate",
          questionType: "theory",
          tags: ["queues", "kafka", "rabbitmq"]
        });
      }

      const hasAdvanced = await Concept.findOne({ title: "Geographical Redundancy Database Architecture" });
      if (!hasAdvanced) {
        seedData.push({
          title: "Geographical Redundancy Database Architecture",
          prompt: "Design a multi-region active-active database replication system.",
          response: "# Geo-Redundant Systems\n\nDesigning geo-redundant databases requires managing latency and conflict resolution. Approaches include CRDTs (Conflict-free Replicated Data Types), Last-Write-Wins policies, or localized master configurations.",
          category: "Databases",
          subcategory: "Replication",
          difficulty: "advanced",
          questionType: "design",
          tags: ["databases", "replication", "geo"]
        });
      }

      const hasExpert = await Concept.findOne({ title: "Raft Consensus Algorithm" });
      if (!hasExpert) {
        seedData.push({
          title: "Raft Consensus Algorithm",
          prompt: "Explain the Raft Consensus Protocol and Leader Election.",
          response: "# Raft Consensus\n\nEnsures state machine replication across a cluster.\n- Leader Election\n- Log Replication\n- Safety guarantees",
          category: "Scalability",
          subcategory: "Distributed Systems",
          difficulty: "expert",
          questionType: "design",
          tags: ["consensus", "raft", "distributed"]
        });
      }

      if (seedData.length > 0) {
        await Concept.insertMany(seedData);
        console.log(`✅ Seeded ${seedData.length} missing concepts successfully!`);
      }
    }
  } catch (err) {
    console.error('❌ Error seeding database:', err.message);
  }
};

// ============================================================
// Seed default test users (Standard User + Admin)
// ============================================================
const seedUsers = async () => {
  try {
    const User = require('../models/User');

    const testUsers = [
      { name: 'Standard User', email: 'user@caia.com', password: 'user1234', role: 'user' },
      { name: 'Admin User', email: 'admin@caia.com', password: 'admin1234', role: 'admin' },
    ];

    for (const userData of testUsers) {
      const exists = await User.findOne({ email: userData.email });
      if (!exists) {
        await User.create(userData);
        console.log(`👤 Created test user: ${userData.email} (${userData.role})`);
      }
    }
  } catch (err) {
    console.error('❌ Error seeding users:', err.message);
  }
};

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`🚀 MongoDB Connected: ${conn.connection.host}`);
    await seedConcepts();
    await seedUsers();
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
