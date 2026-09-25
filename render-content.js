(function () {
    function setText(selector, value) {
        var element = document.querySelector(selector);
        if (element) {
            element.textContent = value;
        }
    }

    function setMeta(name, value) {
        var element = document.querySelector('meta[name="' + name + '"]');
        if (element) {
            element.setAttribute("content", value);
        }
    }

    function escapeHtml(value) {
        return String(value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    function renderInlineMarkdown(value) {
        return escapeHtml(value)
            .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
            .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
            .replace(/\*([^*]+)\*/g, "<em>$1</em>");
    }

    function renderMarkdownBlocks(value) {
        return String(value)
            .trim()
            .split(/\n\s*\n/)
            .map(function (paragraph) {
                return "<p>" + renderInlineMarkdown(paragraph.replace(/\n/g, " ")) + "</p>";
            })
            .join("");
    }

    function setMarkdown(selector, value) {
        var element = document.querySelector(selector);
        if (element) {
            element.innerHTML = renderInlineMarkdown(value);
        }
    }

    function renderMarkdown(selector, value) {
        var container = document.querySelector(selector);
        if (!container) {
            return;
        }

        container.innerHTML = renderMarkdownBlocks(value);
    }

    function renderList(selector, items) {
        var container = document.querySelector(selector);
        if (!container) {
            return;
        }

        container.innerHTML = "";
        items.forEach(function (item) {
            var listItem = document.createElement("li");
            listItem.textContent = item;
            container.appendChild(listItem);
        });
    }

    function appendRow(tableBody, values) {
        var row = document.createElement("tr");
        values.forEach(function (value) {
            var cell = document.createElement("td");
            cell.textContent = value;
            row.appendChild(cell);
        });
        tableBody.appendChild(row);
    }

    function renderWorkExperience(selector, items) {
        var tableBody = document.querySelector(selector);
        if (!tableBody) {
            return;
        }

        tableBody.innerHTML = "";
        items.forEach(function (item) {
            appendRow(tableBody, [item.dates, item.works]);
        });
    }

    function renderSkills(selector, items) {
        var tableBody = document.querySelector(selector);
        if (!tableBody) {
            return;
        }

        tableBody.innerHTML = "";
        items.forEach(function (item) {
            appendRow(tableBody, [item.name, item.rating]);
        });
    }

    function renderCertifications(selector, items) {
        var tableBody = document.querySelector(selector);
        if (!tableBody) {
            return;
        }

        tableBody.innerHTML = "";
        items.forEach(function (item) {
            var row = document.createElement("tr");
            var cell = document.createElement("td");
            var link = document.createElement("a");
            link.href = item.url;
            link.textContent = item.label;
            cell.appendChild(link);
            row.appendChild(cell);
            tableBody.appendChild(row);
        });
    }

    function renderLinks(selector, items) {
        var container = document.querySelector(selector);
        if (!container) {
            return;
        }

        container.innerHTML = "";
        items.forEach(function (item) {
            var link = document.createElement("a");
            link.href = item.url;
            link.textContent = item.label;
            container.appendChild(link);
        });
    }

    function setHref(selector, value) {
        var element = document.querySelector(selector);
        if (element) {
            element.href = value;
        }
    }

    function setInputValue(selector, value) {
        var element = document.querySelector(selector);
        if (element) {
            element.value = value;
        }
    }

    function renderResumePage(content) {
        document.title = content.page.title;
        setMeta("description", content.page.description);
        setMeta("keyword", content.page.keyword);
        setMeta("author", content.page.author);

        var image = document.querySelector("[data-profile-image]");
        if (image) {
            image.src = content.profile.image;
            image.alt = content.profile.imageAlt;
        }

        setText("[data-profile-name]", content.profile.name);
        setText("[data-profile-role]", content.profile.role);
        renderMarkdown("[data-profile-summary]", content.profile.summary);
        renderList("[data-specialties]", content.specialties);
        renderWorkExperience("[data-work-experience]", content.workExperience);
        renderSkills("[data-skills]", content.skills);
        renderCertifications("[data-certifications]", content.certifications);
        renderLinks("[data-links]", content.links);
    }

    function renderAboutPage(content) {
        document.title = content.about.pageTitle;
        setText("[data-about-name]", content.about.heroName);
        setMarkdown("[data-about-profession]", content.about.profession);
        setText("[data-about-greeting]", content.about.greeting);
        setMarkdown("[data-about-intro]", content.about.intro);
        setText("[data-about-career-heading]", content.about.careerHeading);
        setText("[data-about-career-title]", content.about.careerTitle);
        setMarkdown("[data-about-career-description]", content.about.careerDescription);
        setText("[data-about-education-title]", content.about.educationTitle);
        setMarkdown("[data-about-education-description]", content.about.educationDescription);
        setText("[data-about-contact-heading]", content.about.contactHeading);
        setText("[data-about-contact-button]", content.about.contactButton);
        setHref("[data-about-contact-button]", "mailto:" + content.about.contactEmail);
        renderLinks("[data-about-footer-links]", content.about.footerLinks);
        setText("[data-about-copyright]", content.about.copyright);
    }

    function renderContactPage(content) {
        document.title = content.contact.pageTitle;
        setText("[data-contact-heading]", content.contact.heading);
        setText("[data-contact-name-label]", content.contact.labels.name);
        setText("[data-contact-email-label]", content.contact.labels.email);
        setText("[data-contact-message-label]", content.contact.labels.message);
        setInputValue("[data-contact-submit]", content.contact.submit);
        setText("[data-contact-thank-you]", content.contact.thankYou);

        var form = document.querySelector("[data-contact-form]");
        if (form) {
            form.action = "mailto:" + content.contact.email;
        }
    }

    function renderPage(content) {
        if (document.querySelector("[data-resume-page]")) {
            renderResumePage(content);
        }

        if (document.querySelector("[data-about-page]")) {
            renderAboutPage(content);
        }

        if (document.querySelector("[data-contact-page]")) {
            renderContactPage(content);
        }
    }

    fetch("reza-profile.json")
        .then(function (response) {
            if (!response.ok) {
                throw new Error("Unable to load reza-profile.json");
            }
            return response.json();
        })
        .then(renderPage)
        .catch(function (error) {
            console.error(error);
        });
}());