# 🎬 VEED MCP Server

A Model Context Protocol (MCP) server that connects GPT to VEED for video creation and editing.

## 🚀 Quick Start

### Your Deployment URLs:
- **Vercel**: `https://your-project-name.vercel.app`
- **Railway**: `https://your-app.railway.app`
- **GitHub Pages**: `https://yourusername.github.io/veed-mcp-server`

### Connect to GPT:
1. Copy your deployment URL
2. Open GPT settings
3. Add MCP server with your URL
4. Start creating videos!

## 🛠️ Available Tools

### 1. Create Video Project
```javascript
create_video_project({
  title: "My Video",
  description: "Video description", 
  template: "tutorial" // tutorial, social, presentation, marketing
})
```

### 2. Add Text to Video
```javascript
add_text_to_video({
  text: "Welcome!",
  position: "center", // top, center, bottom, left, right
  duration: 5, // seconds
  fontSize: 24,
  color: "white" // white, black, red, blue, green, yellow
})
```

### 3. Add Subtitles
```javascript
add_subtitle({
  text: "Hello everyone",
  startTime: 0, // seconds
  endTime: 3, // seconds
  language: "en" // en, es, fr, de, etc.
})
```

### 4. Export Video
```javascript
export_video({
  quality: "1080p", // 480p, 720p, 1080p, 4k
  format: "mp4", // mp4, mov, avi, webm
  compression: "medium" // low, medium, high
})
```

### 5. Get Project Status
```javascript
get_project_status({
  projectId: "your-project-id"
})
```

## 📝 Example GPT Commands

```
"Create a video project called 'Tutorial Introduction'"
"Add text 'Welcome to my channel!' at the top for 3 seconds"
"Add a subtitle 'Thanks for watching' from 10 to 13 seconds"
"Export the video in 1080p MP4 format"
"Check the status of my current project"
```

## ⚙️ Configuration

### Step 1: Edit Your UUID
In `server.js`, replace:
```javascript
const VEED_UUID = 'YOUR_ACTUAL_UUID_HERE';
```

### Step 2: Connect Real VEED API
When ready, uncomment the real API call section in `callVeedAPI()` function.

## 🌐 Deployment Guide

### Option 1: Vercel (Recommended) ⭐
1. Go to [vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Click "New Project"
4. Import your `veed-mcp-server` repository
5. Click "Deploy"
6. Copy your URL: `https://your-project.vercel.app`

### Option 2: Railway 🚂
1. Go to [railway.app](https://railway.app)
2. Sign in with GitHub
3. "New Project" → "Deploy from GitHub repo"
4. Select your repository
5. Wait for deployment
6. Copy your URL: `https://your-app.railway.app`

### Option 3: GitHub Pages 📄
1. In your repo, go to Settings → Pages
2. Source: Deploy from a branch
3. Branch: main
4. Folder: / (root)
5. Save and wait for deployment
6. URL: `https://yourusername.github.io/veed-mcp-server`

## 🧪 Testing Your Server

### Local Testing
```bash
npm install
npm start
# Open http://localhost:3000
```

### Live Testing
Visit your deployment URL and test:
- `/` - Server info
- `/tools/list` - Available tools  
- `/health` - Health check

### GPT Testing
```
"Create a video project called 'Test Video'"
"Add text 'Hello World!' to the center"
"Export video in 720p"
```

## 📁 File Structure
```
veed-mcp-server/
├── package.json          # Dependencies
├── server.js             # Main MCP server
├── index.html            # Test interface
├── README.md             # This file
├── vercel.json           # Vercel config
└── .github/
    └── workflows/
        └── deploy.yml     # Auto-deployment
```

## 🔒 Security Notes

- ✅ CORS enabled for GPT access
- ✅ UUID-based authentication with VEED
- ✅ Input validation on all endpoints
- ⚠️ Keep your UUID private
- ⚠️ Monitor API usage limits

## 🐛 Troubleshooting

### Server Won't Start
```bash
# Check node version
node --version  # Should be 18+

# Install dependencies
npm install

# Check for errors
npm start
```

### GPT Can't Connect
1. ✅ Test your URL in browser
2. ✅ Check CORS headers
3. ✅ Verify `/tools/list` returns JSON
4. ✅ Make sure server is public

### VEED Integration Issues
1. ✅ Verify UUID is correct in `server.js`
2. ✅ Check VEED API documentation
3. ✅ Replace mock API calls with real ones
4. ✅ Test with smaller requests first

### Deployment Fails
1. ✅ Check deployment logs
2. ✅ Verify all files uploaded correctly
3. ✅ Ensure `package.json` is valid
4. ✅ Check platform-specific requirements

## 📊 Monitoring

### Server Health
- Health check: `GET /health`
- Returns: status, timestamp, UUID, tool count

### API Usage
- All calls logged to console
- Error tracking with timestamps
- UUID included in all responses

## 🔄 Updates

### Adding New Tools
1. Add tool definition to `/tools/list`
2. Add handler function in `/tools/call`
3. Implement the tool logic
4. Test with GPT

### Upgrading VEED API
1. Update `callVeedAPI()` function
2. Replace mock responses with real API
3. Update error handling
4. Test all endpoints

## 📞 Support

- 🐛 **Bugs**: Check deployment logs
- ❓ **Questions**: Test endpoints manually
- 🔧 **Issues**: Verify UUID and API access
- 📖 **Docs**: Check VEED API documentation

## 🏆 Success Checklist

- ✅ All 6 files uploaded to GitHub
- ✅ UUID updated in `server.js`  
- ✅ Successfully deployed to hosting platform
- ✅ Test page loads at deployment URL
- ✅ Health check returns green status
- ✅ Tools list shows 5 available tools
- ✅ GPT connects without errors
- ✅ Video commands work in GPT
- ✅ Ready to integrate real VEED API!

---

🎉 **You're ready to start creating videos with GPT + VEED!**