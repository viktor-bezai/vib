from googleapiclient.discovery import build

# Replace with your own API key
api_key = "AIzaSyClgw5F0_jP5D9xU2mwXyoG4F78MHi885w"
youtube = build('youtube', 'v3', developerKey=api_key)


def search_videos(query):
    request = youtube.search().list(
        part="snippet",
        maxResults=5,  # Number of results to fetch
        q=query,
        type="video"
    )
    response = request.execute()

    videos = []
    for item in response['items']:
        video_data = {
            'title': item['snippet']['title'],
            'description': item['snippet']['description'],
            'video_url': f"https://www.youtube.com/watch?v={item['id']['videoId']}"
        }
        videos.append(video_data)

    return videos


# Example usage
keyword = "Python programming tutorials"
videos = search_videos(keyword)
for idx, video in enumerate(videos):
    print(f"{idx + 1}. Title: {video['title']}")
    print(f"   Description: {video['description']}")
    print(f"   URL: {video['video_url']}\n")
