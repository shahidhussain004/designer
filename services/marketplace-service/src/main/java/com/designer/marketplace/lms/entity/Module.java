package com.designer.marketplace.lms.entity;

import java.util.ArrayList;
import java.util.List;

/**
 * Module - a section within a course containing lessons.
 * Embedded in Course document.
 */
public class Module {

    private String id;
    private String title;
    private String description;
    private Integer orderIndex;
    private List<Lesson> lessons = new ArrayList<>();
    private Boolean isPreview = false;

    public Module() {}

    public Module(String id, String title, String description, Integer orderIndex, 
                  List<Lesson> lessons, Boolean isPreview) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.orderIndex = orderIndex;
        this.lessons = lessons != null ? lessons : new ArrayList<>();
        this.isPreview = isPreview;
    }

    // Getters
    public String getId() { return id; }
    public String getTitle() { return title; }
    public String getDescription() { return description; }
    public Integer getOrderIndex() { return orderIndex; }
    public List<Lesson> getLessons() { return lessons; }
    public Boolean getIsPreview() { return isPreview; }

    // Setters
    public void setId(String id) { this.id = id; }
    public void setTitle(String title) { this.title = title; }
    public void setDescription(String description) { this.description = description; }
    public void setOrderIndex(Integer orderIndex) { this.orderIndex = orderIndex; }
    public void setLessons(List<Lesson> lessons) { this.lessons = lessons; }
    public void setIsPreview(Boolean isPreview) { this.isPreview = isPreview; }

    public int getTotalDurationMinutes() {
        if (lessons == null) return 0;
        return lessons.stream()
                .mapToInt(l -> l.getDurationMinutes() != null ? l.getDurationMinutes() : 0)
                .sum();
    }

    public static ModuleBuilder builder() { return new ModuleBuilder(); }

    public static class ModuleBuilder {
        private String id;
        private String title;
        private String description;
        private Integer orderIndex;
        private List<Lesson> lessons = new ArrayList<>();
        private Boolean isPreview = false;

        public ModuleBuilder id(String id) { this.id = id; return this; }
        public ModuleBuilder title(String title) { this.title = title; return this; }
        public ModuleBuilder description(String description) { this.description = description; return this; }
        public ModuleBuilder orderIndex(Integer orderIndex) { this.orderIndex = orderIndex; return this; }
        public ModuleBuilder lessons(List<Lesson> lessons) { this.lessons = lessons; return this; }
        public ModuleBuilder isPreview(Boolean isPreview) { this.isPreview = isPreview; return this; }
        public Module build() {
            return new Module(id, title, description, orderIndex, lessons, isPreview);
        }
    }
}
