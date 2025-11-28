export const mockData = {
  trips: [
    {
      id: 1,
      destination: 'New York City',
      startDate: '2023-10-01',
      endDate: '2023-10-05',
      fillActivities: true,
      dailyPlan: [
        {
          date: '10/01',
          activities: [
            {
              id: 1,
              title: 'Central Park Walk',
              time: '10:00 - 11:00',
              description: 'Explore the beautiful Central Park'
            },
            {
              id: 2,
              title: 'Times Square Visit',
              time: '14:00 - 15:00',
              description: 'Visit the iconic Times Square'
            }
          ]
        },
        {
          date: '10/02',
          activities: [
            {
              id: 3,
              title: 'Statue of Liberty',
              time: '09:00 - 12:00',
              description: 'Tour the Statue of Liberty'
            }
          ]
        }
      ]
    }
  ],
  activities: [
    {
      id: 1,
      title: 'Central Park Walk',
      time: '10:00 - 11:00',
      description: 'Explore the beautiful Central Park'
    },
    {
      id: 2,
      title: 'Times Square Visit',
      time: '14:00 - 15:00',
      description: 'Visit the iconic Times Square'
    },
    {
      id: 3,
      title: 'Statue of Liberty',
      time: '09:00 - 12:00',
      description: 'Tour the Statue of Liberty'
    }
  ],
  destinations: [
    {
      id: 1,
      name: 'New York City',
      image: 'nyc.jpg'
    },
    {
      id: 2,
      name: 'Paris',
      image: 'paris.jpg'
    },
    {
      id: 3,
      name: 'Tokyo',
      image: 'tokyo.jpg'
    }
  ],
  guides: [
    {
      id: 1,
      title: 'NYC Food Guide',
      author: 'John Doe',
      image: 'guide1.jpg'
    },
    {
      id: 2,
      title: 'Paris Hidden Gems',
      author: 'Jane Smith',
      image: 'guide2.jpg'
    }
  ]
};