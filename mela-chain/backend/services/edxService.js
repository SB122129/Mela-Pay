import axios from 'axios';
import Course from '../models/Course.js';

const EDX_API_BASE = process.env.EDX_API_BASE || 'https://api.edx.org/catalog/v1';
const DOT_PRICE_USD = 5.50; // Default DOT price, should be fetched from an API in production

class EdXService {
  /**
   * Fetch courses from EdX API
   */
  async fetchCoursesFromEdX(limit = 20, offset = 0) {
    try {
      const response = await axios.get(`${EDX_API_BASE}/courses`, {
        params: {
          limit,
          offset,
          exclude_utm: 1
        },
        timeout: 10000
      });

      return {
        ...response.data,
        source: 'edx'
      };
    } catch (error) {
      console.error('Error fetching from EdX API:', error.message);

      const useMockData =
        process.env.USE_EDX_MOCK === 'true' ||
        process.env.NODE_ENV !== 'production';

      if (!useMockData) {
        throw error;
      }

      const mockData = this.getMockCourses();

      return {
        ...mockData,
        source: 'mock',
        error: error.message,
        status: error.response?.status
      };
    }
  }

  /**
   * Get mock courses for development/testing
   */
  getMockCourses() {
    return {
      count: 10,
      results: [
        {
          key: 'MITx+6.00.1x',
          title: 'Introduction to Computer Science and Programming Using Python',
          short_description: 'An introduction to computer science as a tool to solve real-world analytical problems using Python 3.5.',
          full_description: 'This course is the first of a two-course sequence: Introduction to Computer Science and Programming Using Python, and Introduction to Computational Thinking and Data Science. Together, they are designed to help people with no prior exposure to computer science or programming learn to think computationally and write programs to tackle useful problems.',
          level_type: 'Introductory',
          subjects: ['Computer Science'],
          image: {
            src: 'https://prod-discovery.edx-cdn.org/media/course/image/da1b2400-322b-459b-97b0-0c557f05d017-f0fa7ca60840.small.png'
          },
          owners: [
            {
              name: 'Massachusetts Institute of Technology',
              logo_image_url: 'https://prod-discovery.edx-cdn.org/organization/logos/44022f13-20df-4666-9111-cede3e5dc5b6-2cc8854e6b8e.png'
            }
          ],
          marketing_url: 'https://www.edx.org/course/introduction-computer-science-mitx-6-00-1x-11'
        },
        {
          key: 'HarvardX+CS50',
          title: 'CS50: Introduction to Computer Science',
          short_description: 'An introduction to the intellectual enterprises of computer science and the art of programming.',
          full_description: 'This is CS50x, Harvard University\'s introduction to the intellectual enterprises of computer science and the art of programming for majors and non-majors alike, with or without prior programming experience.',
          level_type: 'Introductory',
          subjects: ['Computer Science'],
          image: {
            src: 'https://prod-discovery.edx-cdn.org/media/course/image/da1b2400-322b-459b-97b0-0c557f05d017-f0fa7ca60840.small.png'
          },
          owners: [
            {
              name: 'Harvard University',
              logo_image_url: 'https://prod-discovery.edx-cdn.org/organization/logos/44022f13-20df-4666-9111-cede3e5dc5b6-2cc8854e6b8e.png'
            }
          ],
          marketing_url: 'https://www.edx.org/course/cs50s-introduction-to-computer-science'
        },
        {
          key: 'BerkeleyX+CS188.1x',
          title: 'Artificial Intelligence',
          short_description: 'Learn the fundamentals of Artificial Intelligence (AI), and apply them.',
          full_description: 'This course will introduce the basic ideas and techniques underlying the design of intelligent computer systems. A specific emphasis will be on the statistical and decision-theoretic modeling paradigm.',
          level_type: 'Intermediate',
          subjects: ['Computer Science', 'Artificial Intelligence'],
          image: {
            src: 'https://prod-discovery.edx-cdn.org/media/course/image/da1b2400-322b-459b-97b0-0c557f05d017-f0fa7ca60840.small.png'
          },
          owners: [
            {
              name: 'University of California, Berkeley',
              logo_image_url: 'https://prod-discovery.edx-cdn.org/organization/logos/44022f13-20df-4666-9111-cede3e5dc5b6-2cc8854e6b8e.png'
            }
          ],
          marketing_url: 'https://www.edx.org/course/artificial-intelligence-uc-berkeleyx-cs188-1x'
        },
        {
          key: 'StanfordOnline+SOE.YCSCS101-SP',
          title: 'Computer Science 101',
          short_description: 'CS101 teaches the essential ideas of Computer Science for a zero-prior-experience audience.',
          full_description: 'CS101 is a self-paced course that teaches the essential ideas of Computer Science for a zero-prior-experience audience. Computers can appear very complicated, but in reality, computers work within just a few, simple patterns.',
          level_type: 'Introductory',
          subjects: ['Computer Science'],
          image: {
            src: 'https://prod-discovery.edx-cdn.org/media/course/image/da1b2400-322b-459b-97b0-0c557f05d017-f0fa7ca60840.small.png'
          },
          owners: [
            {
              name: 'Stanford University',
              logo_image_url: 'https://prod-discovery.edx-cdn.org/organization/logos/44022f13-20df-4666-9111-cede3e5dc5b6-2cc8854e6b8e.png'
            }
          ],
          marketing_url: 'https://www.edx.org/course/computer-science-101'
        },
        {
          key: 'MITx+6.86x',
          title: 'Machine Learning with Python',
          short_description: 'Master the essentials of machine learning and algorithms to help improve learning from data.',
          full_description: 'Machine learning methods are commonly used across engineering and sciences, from computer systems to physics. This course covers the theory and practical algorithms for machine learning from a variety of perspectives.',
          level_type: 'Advanced',
          subjects: ['Computer Science', 'Data Science', 'Machine Learning'],
          image: {
            src: 'https://prod-discovery.edx-cdn.org/media/course/image/da1b2400-322b-459b-97b0-0c557f05d017-f0fa7ca60840.small.png'
          },
          owners: [
            {
              name: 'Massachusetts Institute of Technology',
              logo_image_url: 'https://prod-discovery.edx-cdn.org/organization/logos/44022f13-20df-4666-9111-cede3e5dc5b6-2cc8854e6b8e.png'
            }
          ],
          marketing_url: 'https://www.edx.org/course/machine-learning-with-python-from-linear-models-to'
        }
      ]
    };
  }

  /**
   * Transform EdX course data to our format
   */
  transformCourse(edxCourse) {
    const basePrice = this.generatePrice();
    const priceInDOT = basePrice / DOT_PRICE_USD;

    return {
      edxId: edxCourse.key,
      title: edxCourse.title,
      description: edxCourse.short_description || edxCourse.full_description || 'No description available',
      imageUrl: edxCourse.image?.src || edxCourse.card_image_url || '',
      price: basePrice,
      priceInDOT: parseFloat(priceInDOT.toFixed(4)),
      institution: edxCourse.owners?.[0]?.name || 'EdX Partner',
      level: this.mapLevel(edxCourse.level_type),
      duration: edxCourse.weeks_to_complete ? `${edxCourse.weeks_to_complete} weeks` : 'Self-paced',
      language: edxCourse.content_language || 'English',
      subjects: edxCourse.subjects || [],
      edxUrl: edxCourse.marketing_url || `https://www.edx.org/course/${edxCourse.key}`,
      isActive: true,
      lastSynced: new Date()
    };
  }

  /**
   * Map EdX level to our format
   */
  mapLevel(edxLevel) {
    const levelMap = {
      'Introductory': 'Beginner',
      'Intermediate': 'Intermediate',
      'Advanced': 'Advanced'
    };
    return levelMap[edxLevel] || 'All Levels';
  }

  /**
   * Generate a random price for courses (in production, this should come from EdX)
   */
  generatePrice() {
    const prices = [49, 99, 149, 199, 249, 299];
    return prices[Math.floor(Math.random() * prices.length)];
  }

  /**
   * Sync courses from EdX to database
   */
  async syncCourses(limit = 50) {
    try {
      console.log('🔄 Starting EdX course sync...');
      const edxData = await this.fetchCoursesFromEdX(limit);
      const isMock = edxData.source === 'mock';

      if (!edxData.results || edxData.results.length === 0) {
        if (isMock) {
          console.log('⚠️ No courses available from mock EdX data');
        } else {
          console.log('⚠️ No courses found from EdX API');
        }
        return {
          synced: 0,
          total: 0,
          isMock,
          source: edxData.source,
          error: edxData.error,
          status: edxData.status
        };
      }

      let syncedCount = 0;

      for (const edxCourse of edxData.results) {
        try {
          const courseData = this.transformCourse(edxCourse);
          
          await Course.findOneAndUpdate(
            { edxId: courseData.edxId },
            courseData,
            { upsert: true, new: true }
          );
          
          syncedCount++;
        } catch (error) {
          console.error(`Error syncing course ${edxCourse.key}:`, error.message);
        }
      }

      if (isMock) {
        console.log(`✅ Synced ${syncedCount} courses (mock EdX data)`);
      } else {
        console.log(`✅ Synced ${syncedCount} courses from EdX`);
      }

      return {
        synced: syncedCount,
        total: edxData.count,
        isMock,
        source: edxData.source,
        error: edxData.error,
        status: edxData.status
      };
    } catch (error) {
      console.error('Error in syncCourses:', error.message);
      throw error;
    }
  }

  /**
   * Get current DOT price (mock - in production use a real API)
   */
  async getDOTPrice() {
    try {
      // In production, fetch from CoinGecko or similar API
      // const response = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=polkadot&vs_currencies=usd');
      // return response.data.polkadot.usd;
      return DOT_PRICE_USD;
    } catch (error) {
      console.error('Error fetching DOT price:', error.message);
      return DOT_PRICE_USD;
    }
  }
}

export default new EdXService();
