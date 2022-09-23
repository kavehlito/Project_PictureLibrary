# WebApp_Project_appPictureLibrary
### Objective

During the course, you will be working on a project in a group.

Pls submit your group’s project solution on LearnPoint, including a Visual Studio Code
Workspace, compressed into zip format. Then I can easily uncompress, open in Visual Studio
Code and run the code. Pls see deadline in “Kursplaneringen” as to the when the projects
need to be submitted.

The project is divided in a G-level and a VG-level part, and the objective is to create a
modern, responsive Web Application with the purpose of viewing and arranging pictures in
albums.

In the project template you are given a few sample photo albums consisting of:

- [https://github.com/martinlenart/WebApp_Project_appPictureLibrary.git](https://github.com/martinlenart/WebApp_Project_appPictureLibrary.git)
- sets of pictures stored in 2 different resolutions: high and low.
- set of album header pictures.
- a JSON-file representing the data model and content of the sample photo albums

### Technical requirements

The Web Application requirements for G-level and VG-level parts are the same, and
following:

- Responsive Web Application, using HTML5, CSS3, JavaScript ES6 strict mode, js DOM
model, running on localhost.
- Using React framework and or Bootstrap is optional.
- Current versions of Edge, Chrome, Firefox, and Safari should be supported but older
browser technologies do not need to be supported.
-CSS media queries should be used so the layout and the resolution of the pictures adapts
to the viewport size used. I.e., Mobile, Tablets and Laptop viewport sizes should have
different and appropriate layouts as well as using different picture resolutions for
performance

### Grade criteria

Godkänt (G) : Successful completion part of “Project – Picture Viewer”.

Väl godkänt (VG): Successful completion of “Project – Picture Album”

**Note:**
The intention of the project is to use the technologies taught during the course. Therefore,
in addition to the G-Level and VG-Level project requirement, grading consideration will be
taken to the implementation and usage of the various technologies. For example,
implementing all the VG-Level use case requirements, but not using CSS3 for styling will not
be considered successful completion and VG-Level grade.

### Project - Picture Viewer: G-Level (Betygsnivå G)

Using the sample album provided, you should develop a responsive web application that
views the albums and pictures in the albums in user friendly and attractive manner.

Use case requirements. User should be able to:

- see all the albums with header picture and header text
- select an album and see all the pictures in that album.
- view picture titles and parts of the picture comment for the pictures in an album.
- view an individual picture in an album in appropriate resolution together with title and
full comment.
- edit and save the title and comments of a picture.
- select pictures in an album and view them in a slide show.
- rate a picture, save the rating, and see the rating together with the picture

### Project - Picture Album: VG-Level (Betygsnivå VG)

- All the requirements of Picture Viewer should be implemented
- Rating-albums should be created for each rating
- Pictures with a particular rating should be placed in the corresponding rating-album in
addition to the album they are originally in.
- A rating-album should be viewable as a normal album (Picture Viewer), including being
able to see as a slide show.
- A user should be able to create and save a new album with header text, and a header
picture uploaded.
- A user should be able to upload a picture in 2 different resolutions (high, low), a
picture title and picture comment. Add the picture to an album and save the album.
- Remove a picture from an album and save the updated album. The actual picture,
residing on the local host does not need to be deleted

**Additional Challenge:**

Moving a picture from one album to another is not a requirement but given as challenge for
those of you with an extra appetite for JavaScript coding. It will nicely complete the picture
album’s use cases.