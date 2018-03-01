import { DocumentNode } from 'graphql';
import gql from 'graphql-tag';

export const configQuery: DocumentNode = gql`
  query allConfigs {
    allConfigs {
      nodes {
        primaryColor,
        secondaryColor,
        tagline,
        heroBanner,
        postByFeaturedStory1 {
          id,
          title,
          subtitle,
          imagesByPostId(condition: {
            type: LEAD_SMALL
          }) {
            nodes {
              url
            }
          }
        }
        postByFeaturedStory2 {
          id,
          title,
          subtitle,
          imagesByPostId(condition: {
            type: LEAD_SMALL
          }) {
            nodes {
              url
            }
          }
        }
        postByFeaturedStory3 {
          id,
          title,
          subtitle,
          imagesByPostId(condition: {
            type: LEAD_SMALL
          }) {
            nodes {
              url
            }
          }
        },
        tripByFeaturedTrip1 {
          id,
          name,
          startDate,
          endDate,
          imagesByTripId(
            condition:{
              type: BANNER
            },
            first: 1
          ) {
            nodes {
              url
            }
          }
        }
      }
    }
  }
`;
