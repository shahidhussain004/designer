package com.designer.marketplace.lms.entity;

import java.util.ArrayList;
import java.util.List;

/**
 * Lesson - individual learning unit within a module.
 * Embedded in Module document.
 */
public class Lesson {

    private String id;
    private String title;
    private String description;
    private LessonType type;
    private Integer orderIndex;
    private Integer durationMinutes;
    private String videoUrl;
    private String videoThumbnailUrl;
    private String textContent;
    private String articleUrl;
    private String downloadUrl;
    private List<Resource> resources = new ArrayList<>();
    private Boolean isPreview = false;
    private Boolean requiresCompletion = true;

    public Lesson() {}

    public Lesson(String id, String title, String description, LessonType type, Integer orderIndex,
                  Integer durationMinutes, String videoUrl, String videoThumbnailUrl, String textContent,
                  String articleUrl, String downloadUrl, List<Resource> resources, Boolean isPreview,
                  Boolean requiresCompletion) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.type = type;
        this.orderIndex = orderIndex;
        this.durationMinutes = durationMinutes;
        this.videoUrl = videoUrl;
        this.videoThumbnailUrl = videoThumbnailUrl;
        this.textContent = textContent;
        this.articleUrl = articleUrl;
        this.downloadUrl = downloadUrl;
        this.resources = resources != null ? resources : new ArrayList<>();
        this.isPreview = isPreview;
        this.requiresCompletion = requiresCompletion;
    }

    // Getters
    public String getId() { return id; }
    public String getTitle() { return title; }
    public String getDescription() { return description; }
    public LessonType getType() { return type; }
    public Integer getOrderIndex() { return orderIndex; }
    public Integer getDurationMinutes() { return durationMinutes; }
    public String getVideoUrl() { return videoUrl; }
    public String getVideoThumbnailUrl() { return videoThumbnailUrl; }
    public String getTextContent() { return textContent; }
    public String getArticleUrl() { return articleUrl; }
    public String getDownloadUrl() { return downloadUrl; }
    public List<Resource> getResources() { return resources; }
    public Boolean getIsPreview() { return isPreview; }
    public Boolean getRequiresCompletion() { return requiresCompletion; }

    // Setters
    public void setId(String id) { this.id = id; }
    public void setTitle(String title) { this.title = title; }
    public void setDescription(String description) { this.description = description; }
    public void setType(LessonType type) { this.type = type; }
    public void setOrderIndex(Integer orderIndex) { this.orderIndex = orderIndex; }
    public void setDurationMinutes(Integer durationMinutes) { this.durationMinutes = durationMinutes; }
    public void setVideoUrl(String videoUrl) { this.videoUrl = videoUrl; }
    public void setVideoThumbnailUrl(String videoThumbnailUrl) { this.videoThumbnailUrl = videoThumbnailUrl; }
    public void setTextContent(String textContent) { this.textContent = textContent; }
    public void setArticleUrl(String articleUrl) { this.articleUrl = articleUrl; }
    public void setDownloadUrl(String downloadUrl) { this.downloadUrl = downloadUrl; }
    public void setResources(List<Resource> resources) { this.resources = resources; }
    public void setIsPreview(Boolean isPreview) { this.isPreview = isPreview; }
    public void setRequiresCompletion(Boolean requiresCompletion) { this.requiresCompletion = requiresCompletion; }

    public enum LessonType {
        VIDEO,
        ARTICLE,
        QUIZ,
        ASSIGNMENT,
        DOWNLOAD,
        LIVE_SESSION
    }

    public static class Resource {
        private String id;
        private String title;
        private String url;
        private ResourceType type;
        private Long fileSizeBytes;

        public Resource() {}

        public Resource(String id, String title, String url, ResourceType type, Long fileSizeBytes) {
            this.id = id;
            this.title = title;
            this.url = url;
            this.type = type;
            this.fileSizeBytes = fileSizeBytes;
        }

        public String getId() { return id; }
        public String getTitle() { return title; }
        public String getUrl() { return url; }
        public ResourceType getType() { return type; }
        public Long getFileSizeBytes() { return fileSizeBytes; }

        public void setId(String id) { this.id = id; }
        public void setTitle(String title) { this.title = title; }
        public void setUrl(String url) { this.url = url; }
        public void setType(ResourceType type) { this.type = type; }
        public void setFileSizeBytes(Long fileSizeBytes) { this.fileSizeBytes = fileSizeBytes; }

        public enum ResourceType {
            PDF,
            ZIP,
            IMAGE,
            LINK,
            OTHER
        }
    }

    public static LessonBuilder builder() { return new LessonBuilder(); }

    public static class LessonBuilder {
        private String id;
        private String title;
        private String description;
        private LessonType type;
        private Integer orderIndex;
        private Integer durationMinutes;
        private String videoUrl;
        private String videoThumbnailUrl;
        private String textContent;
        private String articleUrl;
        private String downloadUrl;
        private List<Resource> resources = new ArrayList<>();
        private Boolean isPreview = false;
        private Boolean requiresCompletion = true;

        public LessonBuilder id(String id) { this.id = id; return this; }
        public LessonBuilder title(String title) { this.title = title; return this; }
        public LessonBuilder description(String description) { this.description = description; return this; }
        public LessonBuilder type(LessonType type) { this.type = type; return this; }
        public LessonBuilder orderIndex(Integer orderIndex) { this.orderIndex = orderIndex; return this; }
        public LessonBuilder durationMinutes(Integer durationMinutes) { this.durationMinutes = durationMinutes; return this; }
        public LessonBuilder videoUrl(String videoUrl) { this.videoUrl = videoUrl; return this; }
        public LessonBuilder videoThumbnailUrl(String videoThumbnailUrl) { this.videoThumbnailUrl = videoThumbnailUrl; return this; }
        public LessonBuilder textContent(String textContent) { this.textContent = textContent; return this; }
        public LessonBuilder articleUrl(String articleUrl) { this.articleUrl = articleUrl; return this; }
        public LessonBuilder downloadUrl(String downloadUrl) { this.downloadUrl = downloadUrl; return this; }
        public LessonBuilder resources(List<Resource> resources) { this.resources = resources; return this; }
        public LessonBuilder isPreview(Boolean isPreview) { this.isPreview = isPreview; return this; }
        public LessonBuilder requiresCompletion(Boolean requiresCompletion) { this.requiresCompletion = requiresCompletion; return this; }
        public Lesson build() {
            return new Lesson(id, title, description, type, orderIndex, durationMinutes, videoUrl, 
                    videoThumbnailUrl, textContent, articleUrl, downloadUrl, resources, isPreview, requiresCompletion);
        }
    }
}
