const initialClasses = [
    {
      id: 1,
      name: 'Math 101',
      units: [
        {
          id: 1,
          name: 'Algebra',
          sessions: [
            {
              id: 1,
              name: 'Algebra Basics',
              lectures: [
                {
                  id: 1,
                  title: 'Introduction to Algebra',
                  content: 'This lecture covers the basics of algebra.'
                }
              ]
            }
          ]
        }
      ]
    }
  ];
  
  // Save initial data to localStorage
  localStorage.setItem('classes', JSON.stringify(initialClasses));
  