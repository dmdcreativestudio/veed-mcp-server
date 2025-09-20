const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

// Your VEED UUID - REPLACE THIS WITH YOUR ACTUAL UUID
const VEED_UUID = '46c7a2f2-a4a5-4d25-b1e1-c38bf3538989';

app.use(cors());
app.use(express.json());

// Serve the index.html file for testing
app.use(express.static('.'));

// MCP Server Info
app.get('/', (req, res) => {
  res.json({
    name: "VEED MCP Server",
    version: "1.0.0",
    description: "MCP Server for VEED video creation and editing",
    protocol_version: "2024-11-05",
    uuid: VEED_UUID,
    status: "ready"
  });
});

// List available tools
app.post('/tools/list', (req, res) => {
  res.json({
    tools: [
      {
        name: "create_video_project",
        description: "Create a new video project in VEED",
        inputSchema: {
          type: "object",
          properties: {
            title: { 
              type: "string", 
              description: "Project title" 
            },
            description: { 
              type: "string", 
              description: "Project description" 
            },
            template: {
              type: "string",
              description: "Template type: tutorial, social, presentation, marketing"
            }
          },
          required: ["title"]
        }
      },
      {
        name: "add_text_to_video",
        description: "Add text overlay to video",
        inputSchema: {
          type: "object",
          properties: {
            text: { 
              type: "string", 
              description: "Text to add to video" 
            },
            position: { 
              type: "string", 
              description: "Position: top, center, bottom, left, right" 
            },
            duration: { 
              type: "number", 
              description: "Duration in seconds" 
            },
            fontSize: {
              type: "number",
              description: "Font size (12-72)"
            },
            color: {
              type: "string",
              description: "Text color: white, black, red, blue, green, yellow"
            }
          },
          required: ["text"]
        }
      },
      {
        name: "add_subtitle",
        description: "Add subtitles to video",
        inputSchema: {
          type: "object",
          properties: {
            text: {
              type: "string",
              description: "Subtitle text"
            },
            startTime: {
              type: "number",
              description: "Start time in seconds"
            },
            endTime: {
              type: "number", 
              description: "End time in seconds"
            },
            language: {
              type: "string",
              description: "Language code: en, es, fr, de, etc."
            }
          },
          required: ["text", "startTime", "endTime"]
        }
      },
      {
        name: "export_video",
        description: "Export the video project",
        inputSchema: {
          type: "object",
          properties: {
            quality: { 
              type: "string", 
              description: "Export quality: 480p, 720p, 1080p, 4k" 
            },
            format: { 
              type: "string", 
              description: "Video format: mp4, mov, avi, webm" 
            },
            compression: {
              type: "string",
              description: "Compression level: low, medium, high"
            }
          }
        }
      },
      {
        name: "get_project_status",
        description: "Get the current status of video project",
        inputSchema: {
          type: "object",
          properties: {
            projectId: {
              type: "string",
              description: "Project ID to check status"
            }
          }
        }
      }
    ]
  });
});

// Handle tool calls
app.post('/tools/call', async (req, res) => {
  const { name, arguments: args } = req.body;
  
  try {
    let result;
    
    switch (name) {
      case 'create_video_project':
        result = await createVideoProject(args);
        break;
        
      case 'add_text_to_video':
        result = await addTextToVideo(args);
        break;
        
      case 'add_subtitle':
        result = await addSubtitle(args);
        break;
        
      case 'export_video':
        result = await exportVideo(args);
        break;
        
      case 'get_project_status':
        result = await getProjectStatus(args);
        break;
        
      default:
        return res.status(400).json({ 
          error: `Unknown tool: ${name}`,
          available_tools: ["create_video_project", "add_text_to_video", "add_subtitle", "export_video", "get_project_status"]
        });
    }
    
    res.json({ 
      content: [{ 
        type: "text", 
        text: result 
      }] 
    });
    
  } catch (error) {
    console.error(`Error in ${name}:`, error);
    res.status(500).json({ 
      error: `Failed to execute ${name}: ${error.message}`,
      uuid: VEED_UUID,
      timestamp: new Date().toISOString()
    });
  }
});

// VEED API Functions
async function createVideoProject(args) {
  try {
    console.log('Creating video project:', args);
    
    // This will call your VEED API using the UUID
    const response = await callVeedAPI('POST', '/projects', {
      title: args.title,
      description: args.description || '',
      template: args.template || 'general',
      uuid: VEED_UUID
    });
    
    const projectId = response.id || `veed_${Date.now()}`;
    
    return `✅ Successfully created video project!
    
📁 Project: "${args.title}"
🆔 Project ID: ${projectId}
📝 Description: ${args.description || 'No description'}
🎨 Template: ${args.template || 'general'}
🔗 UUID: ${VEED_UUID}

Ready to add content! Try:
• "Add text 'Welcome!' to the center"
• "Add subtitle 'Hello everyone' from 0 to 3 seconds"
• "Export video in 1080p MP4"`;
    
  } catch (error) {
    throw new Error(`Failed to create project: ${error.message}`);
  }
}

async function addTextToVideo(args) {
  try {
    console.log('Adding text to video:', args);
    
    const response = await callVeedAPI('POST', '/elements/text', {
      text: args.text,
      position: args.position || 'center',
      duration: args.duration || 5,
      fontSize: args.fontSize || 24,
      color: args.color || 'white',
      uuid: VEED_UUID
    });
    
    return `✅ Added text overlay to video!
    
📝 Text: "${args.text}"
📍 Position: ${args.position || 'center'}
⏱️ Duration: ${args.duration || 5} seconds
🎨 Style: ${args.fontSize || 24}px, ${args.color || 'white'}
🔗 Element ID: ${response.id || 'text_' + Date.now()}

Text has been added to your video project!`;
    
  } catch (error) {
    throw new Error(`Failed to add text: ${error.message}`);
  }
}

async function addSubtitle(args) {
  try {
    console.log('Adding subtitle:', args);
    
    const response = await callVeedAPI('POST', '/subtitles', {
      text: args.text,
      startTime: args.startTime,
      endTime: args.endTime,
      language: args.language || 'en',
      uuid: VEED_UUID
    });
    
    return `✅ Added subtitle to video!
    
💬 Subtitle: "${args.text}"
⏰ Timeline: ${args.startTime}s → ${args.endTime}s
🌍 Language: ${args.language || 'en'}
🔗 Subtitle ID: ${response.id || 'sub_' + Date.now()}

Subtitle has been synchronized with your video!`;
    
  } catch (error) {
    throw new Error(`Failed to add subtitle: ${error.message}`);
  }
}

async function exportVideo(args) {
  try {
    console.log('Exporting video:', args);
    
    const response = await callVeedAPI('POST', '/export', {
      quality: args.quality || '1080p',
      format: args.format || 'mp4',
      compression: args.compression || 'medium',
      uuid: VEED_UUID
    });
    
    const exportId = response.exportId || `export_${Date.now()}`;
    
    return `✅ Video export started!
    
🎬 Export Settings:
• Quality: ${args.quality || '1080p'}
• Format: ${args.format || 'mp4'}
• Compression: ${args.compression || 'medium'}

📊 Export Status:
• Export ID: ${exportId}
• Status: Processing
• Estimated time: 2-5 minutes

🔗 Your VEED UUID: ${VEED_UUID}

You'll receive a callback when export is complete!`;
    
  } catch (error) {
    throw new Error(`Failed to export video: ${error.message}`);
  }
}

async function getProjectStatus(args) {
  try {
    console.log('Getting project status:', args);
    
    const response = await callVeedAPI('GET', `/projects/${args.projectId || 'current'}`, {
      uuid: VEED_UUID
    });
    
    return `📊 Project Status Report:
    
🆔 Project ID: ${args.projectId || 'current'}
📁 Status: ${response.status || 'active'}
⏱️ Last Modified: ${response.lastModified || new Date().toISOString()}
🎬 Elements: ${response.elementCount || 'Unknown'} items
📝 Duration: ${response.duration || 'Calculating...'}

🔗 UUID: ${VEED_UUID}

Project is ready for editing and export!`;
    
  } catch (error) {
    throw new Error(`Failed to get project status: ${error.message}`);
  }
}

// VEED API Helper Function
async function callVeedAPI(method, endpoint, data) {
  console.log(`🔄 VEED API Call: ${method} ${endpoint}`, {
    uuid: VEED_UUID,
    data: data
  });
  
  // FOR TESTING: Return mock data
  // When you have real VEED API access, replace this section
  const mockResponse = {
    id: `veed_${Date.now()}`,
    status: 'success',
    exportId: `export_${Date.now()}`,
    elementCount: Math.floor(Math.random() * 10) + 1,
    duration: `${Math.floor(Math.random() * 60) + 30}s`,
    lastModified: new Date().toISOString(),
    data: data
  };
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return mockResponse;
  
  /* 
  // REAL VEED API CALL (uncomment when ready):
  try {
    const response = await axios({
      method: method,
      url: `https://api.veed.io/v1${endpoint}`,
      headers: {
        'Authorization': `Bearer ${VEED_UUID}`,
        'Content-Type': 'application/json',
        'User-Agent': 'VEED-MCP-Server/1.0.0'
      },
      data: method !== 'GET' ? data : undefined,
      params: method === 'GET' ? data : undefined,
      timeout: 30000
    });
    
    return response.data;
  } catch (error) {
    console.error('VEED API Error:', error.response?.data || error.message);
    throw new Error(`VEED API Error: ${error.response?.data?.message || error.message}`);
  }
  */
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    uuid: VEED_UUID,
    server: 'VEED MCP Server v1.0.0',
    tools: 5
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 VEED MCP Server running on port ${PORT}`);
  console.log(`📡 Server URL: http://localhost:${PORT}`);
  console.log(`🔧 Tools endpoint: http://localhost:${PORT}/tools/list`);
  console.log(`🆔 VEED UUID: ${VEED_UUID}`);
  console.log(`🌐 Ready for GPT connection!`);
});