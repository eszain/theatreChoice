import dbConnect from '../src/lib/dbConnect';
import Theatre from '../src/models/Theatre';

const theatreFormats = [
  { name: 'IMAX' },
  { name: 'UltraAVX' },
  { name: 'VIP' },
  { name: 'D-BOX' },
  { name: 'ScreenX' },
  { name: '4DX' },
  { name: '3D' },
  { name: 'Regular' },
];

const seedTheatres = async () => {
  try {
    await dbConnect();
    await Theatre.deleteMany({});
    await Theatre.insertMany(theatreFormats);
    console.log('Theatres seeded successfully!');
  } catch (error) {
    console.error('Error seeding theatres:', error);
  } finally {
    process.exit();
  }
};

seedTheatres();