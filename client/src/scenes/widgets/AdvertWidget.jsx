import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  useTheme, 
  Card, 
  CardMedia, 
  CardContent, 
  Fade,
  Button,
  Chip,
  Tooltip,
  alpha
} from "@mui/material";
import { 
  OpenInNew as LinkIcon
} from "@mui/icons-material";
import FlexBetween from "components/FlexBetween";
import WidgetWrapper from "components/WidgetWrapper";

const SPONSORED_CONTENT = [
  {
    id: 1,
    title: "Apple",
    description: "Innovative technology that empowers creativity and connection.",
    website: "www.apple.com",
    image: "https://images.pexels.com/photos/326503/pexels-photo-326503.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    category: "Technology",
    primaryColor: "#0070C9",
    secondaryColor: "#5AC8FA"
  },
  {
    id: 2,
    title: "Nike",
    description: "Just Do It. Inspiring athletes and innovating sports performance.",
    website: "www.nike.com",
    image: "https://images.pexels.com/photos/1103830/pexels-photo-1103830.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    category: "Sports & Fitness",
    primaryColor: "#FF6000",
    secondaryColor: "#FF8F5E"
  },
  {
    id: 3,
    title: "Starbucks",
    description: "More than great coffee. Connecting people, sharing moments.",
    website: "www.starbucks.com",
    image: "https://images.pexels.com/photos/312418/pexels-photo-312418.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    category: "Food & Beverage",
    primaryColor: "#00704A",
    secondaryColor: "#2C5E4F"
  },
  {
    id: 4,
    title: "Tesla",
    description: "Accelerating the world's transition to sustainable energy.",
    website: "www.tesla.com",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bd/Tesla_Motors.svg/1200px-Tesla_Motors.svg.png",
    category: "Automotive",
    primaryColor: "#CC0000",
    secondaryColor: "#FF3333"
  },
  {
    id: 5,
    title: "Spotify",
    description: "Music for everyone. Discover, manage, and share your favorite tracks.",
    website: "www.spotify.com",
    image: "https://images.pexels.com/photos/1763067/pexels-photo-1763067.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    category: "Entertainment",
    primaryColor: "#1DB954",
    secondaryColor: "#1ED760"
  }
];

const AdvertWidget = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  // eslint-disable-next-line no-unused-vars
  const { palette } = useTheme();

  useEffect(() => {
    const rotationInterval = setInterval(() => {
      setIsVisible(false);
      
      setTimeout(() => {
        setCurrentIndex((prevIndex) => 
          (prevIndex + 1) % SPONSORED_CONTENT.length
        );
        setIsVisible(true);
      }, 500); // Half-second fade out
    }, 7000); // 7 seconds

    return () => clearInterval(rotationInterval);
  }, []);

  const handleNextAdvert = () => {
    setIsVisible(false);
    setTimeout(() => {
      setCurrentIndex((prevIndex) => 
        (prevIndex + 1) % SPONSORED_CONTENT.length
      );
      setIsVisible(true);
    }, 500);
  };

  const handlePrevAdvert = () => {
    setIsVisible(false);
    setTimeout(() => {
      setCurrentIndex((prevIndex) => 
        (prevIndex - 1 + SPONSORED_CONTENT.length) % SPONSORED_CONTENT.length
      );
      setIsVisible(true);
    }, 500);
  };

  const currentAdvert = SPONSORED_CONTENT[currentIndex];

  const handleVisitWebsite = () => {
    window.open(`https://${currentAdvert.website}`, '_blank');
  };

  return (
    <WidgetWrapper 
      sx={{ 
        position: 'relative', 
        overflow: 'hidden',
        borderRadius: 3,
        boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
        transition: 'all 0.5s ease'
      }}
    >
      {/* Navigation Controls */}
      <Box 
        sx={{ 
          position: 'absolute', 
          top: '50%', 
          left: 0, 
          right: 0, 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          zIndex: 10,
          px: 1,
          transform: 'translateY(-50%)'
        }}
      >
        <Tooltip title="Previous Sponsor" placement="left">
          <Box
            onClick={handlePrevAdvert}
            sx={{ 
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 40,
              height: 40,
              borderRadius: '50%',
              backgroundColor: alpha('#000', 0.1),
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              '&:hover': {
                backgroundColor: alpha('#000', 0.2),
                transform: 'scale(1.1)',
                boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
              }
            }}
          >
            <Typography 
              sx={{ 
                fontSize: '1.5rem',
                fontWeight: 'bold',
                color: 'rgba(0,0,0,0.7)',
                lineHeight: 1,
                transform: 'translateX(-1px)'
              }}
            >
              {'<'}
            </Typography>
          </Box>
        </Tooltip>
        
        <Tooltip title="Next Sponsor" placement="right">
          <Box
            onClick={handleNextAdvert}
            sx={{ 
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 40,
              height: 40,
              borderRadius: '50%',
              backgroundColor: alpha('#000', 0.1),
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              '&:hover': {
                backgroundColor: alpha('#000', 0.2),
                transform: 'scale(1.1)',
                boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
              }
            }}
          >
            <Typography 
              sx={{ 
                fontSize: '1.5rem',
                fontWeight: 'bold',
                color: 'rgba(0,0,0,0.7)',
                lineHeight: 1,
                transform: 'translateX(1px)'
              }}
            >
              {'>'}
            </Typography>
          </Box>
        </Tooltip>
      </Box>

      <Fade in={isVisible} timeout={500}>
        <Box>
          {/* Header */}
          <FlexBetween mb={2}>
            <Typography 
              variant="h5" 
              fontWeight={600} 
              color="text.primary"
            >
              Sponsored
            </Typography>
            <Chip 
              label={currentAdvert.category} 
              size="small" 
              sx={{ 
                backgroundColor: currentAdvert.primaryColor, 
                color: 'white',
                transition: 'transform 0.3s ease',
                '&:hover': {
                  transform: 'scale(1.05)'
                }
              }} 
            />
          </FlexBetween>

          {/* Sponsored Image */}
          <Card 
            sx={{ 
              borderRadius: 3, 
              boxShadow: 'none',
              position: 'relative',
              overflow: 'hidden',
              cursor: 'pointer',
              transition: 'transform 0.3s ease',
              '&:hover': {
                transform: 'scale(1.02)',
                boxShadow: '0 12px 24px rgba(0,0,0,0.1)'
              }
            }}
            onClick={handleVisitWebsite}
          >
            <CardMedia
              component="img"
              height="250"
              image={currentAdvert.image}
              alt={currentAdvert.title}
              onError={(e) => {
                e.target.onerror = null; // Prevent infinite loop
                e.target.src = `https://via.placeholder.com/250x250.png?text=${encodeURIComponent(currentAdvert.title)}`;
              }}
              sx={{ 
                objectFit: 'cover',
                filter: 'brightness(0.9)',
                transition: 'all 0.5s ease',
                '&:hover': {
                  transform: 'scale(1.05)',
                  filter: 'brightness(1)'
                }
              }}
            />
            
            {/* Gradient Overlay */}
            <Box
              sx={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                background: `linear-gradient(to top, ${currentAdvert.primaryColor}CC, transparent)`,
                height: '50%',
                display: 'flex',
                alignItems: 'flex-end',
                p: 2
              }}
            >
              <CardContent sx={{ color: 'white', p: 0 }}>
                <Typography 
                  variant="h6" 
                  fontWeight={600} 
                  gutterBottom
                >
                  {currentAdvert.title}
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ opacity: 0.8 }}
                >
                  {currentAdvert.description}
                </Typography>
              </CardContent>
            </Box>
          </Card>

          {/* Footer */}
          <FlexBetween mt={2}>
            <Typography 
              variant="body2" 
              color="text.secondary"
            >
              {currentAdvert.website}
            </Typography>
            
            <Button 
              variant="contained" 
              size="small"
              endIcon={<LinkIcon />}
              onClick={handleVisitWebsite}
              sx={{ 
                backgroundColor: currentAdvert.primaryColor,
                transition: 'transform 0.3s ease',
                '&:hover': {
                  backgroundColor: currentAdvert.secondaryColor,
                  transform: 'scale(1.05)'
                }
              }}
            >
              Visit Site
            </Button>
          </FlexBetween>

          {/* Sponsor Indicators */}
          <Box 
            display="flex" 
            justifyContent="center" 
            mt={2}
            sx={{ gap: 1 }}
          >
            {SPONSORED_CONTENT.map((_, index) => (
              <Box
                key={index}
                sx={{
                  width: 10,
                  height: 10,
                  borderRadius: '50%',
                  backgroundColor: index === currentIndex 
                    ? currentAdvert.primaryColor 
                    : 'rgba(0,0,0,0.2)',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'scale(1.2)',
                    backgroundColor: currentAdvert.primaryColor
                  }
                }}
                onClick={() => {
                  if (index !== currentIndex) {
                    setIsVisible(false);
                    setTimeout(() => {
                      setCurrentIndex(index);
                      setIsVisible(true);
                    }, 500);
                  }
                }}
              />
            ))}
          </Box>
        </Box>
      </Fade>
    </WidgetWrapper>
  );
};

export default AdvertWidget;
