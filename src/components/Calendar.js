import React, { useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import './Calendar.css';

const CalendarComponent = () => {
    const [notes, setNotes] = useState({});
    const [selectedDay, setSelectedDay] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalData, setModalData] = useState({
        date: '',
        note: '',
        importance: 'Normal',
        subtasks: [''],
        range: ['', '']
    });

    const handleDateClick = (arg) => {
        const clickedDate = arg.dateStr;
        setSelectedDay(clickedDate);
        setModalOpen(true);
        setModalData({
            date: clickedDate,
            note: '',
            importance: 'Normal',
            subtasks: [''],
            range: [clickedDate, clickedDate]
        });
    };

    const saveNote = () => {
        if (!modalData.note.trim()) return alert('Заметка не может быть пустой!');

        const updatedNotes = { ...notes };
        const noteId = Date.now();

        const newNote = {
            id: noteId,
            note: modalData.note,
            importance: modalData.importance,
            subtasks: modalData.subtasks
        };

        const start = new Date(modalData.range[0]);
        const end = new Date(modalData.range[1]);
        let current = new Date(start);

        while (current <= end) {
            const key = current.toISOString().split('T')[0];
            if (!updatedNotes[key]) updatedNotes[key] = [];
            updatedNotes[key].push(newNote);
            current.setDate(current.getDate() + 1);
        }

        setNotes(updatedNotes);
        setModalOpen(false);
    };

    const events = Object.entries(notes).flatMap(([date, notesArray]) =>
        notesArray.map(note => ({
            title: note.note,
            start: date,
            allDay: true
        }))
    );

    return (
        <div className="calendar-wrapper">
            <FullCalendar
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                headerToolbar={{
                    left: 'prev,next today',
                    center: 'title',
                    right: 'dayGridMonth,timeGridWeek,timeGridDay'
                }}
                dateClick={handleDateClick}
                events={events}
            />

            {modalOpen && (
                <div className="note-modal">
                    <h3>Добавить заметку на {modalData.date}</h3>
                    <textarea value={modalData.note} onChange={(e) => setModalData({ ...modalData, note: e.target.value })} />
                    <select value={modalData.importance} onChange={(e) => setModalData({ ...modalData, importance: e.target.value })}>
                        <option value="Low">Низкая</option>
                        <option value="Normal">Средняя</option>
                        <option value="High">Высокая</option>
                    </select>
                    {modalData.subtasks.map((sub, i) => (
                        <input key={i} value={sub} onChange={(e) => {
                            const newSubs = [...modalData.subtasks];
                            newSubs[i] = e.target.value;
                            setModalData({ ...modalData, subtasks: newSubs });
                        }} />
                    ))}
                    <button onClick={() => setModalData({ ...modalData, subtasks: [...modalData.subtasks, ''] })}>Добавить подпункт</button>
                    <input type="date" value={modalData.range[0]} onChange={(e) => {
                        const range = [...modalData.range];
                        range[0] = e.target.value;
                        setModalData({ ...modalData, range });
                    }} />
                    <input type="date" value={modalData.range[1]} onChange={(e) => {
                        const range = [...modalData.range];
                        range[1] = e.target.value;
                        setModalData({ ...modalData, range });
                    }} />
                    <button onClick={() => setModalOpen(false)}>Закрыть</button>
                    <button onClick={saveNote}>Сохранить</button>
                </div>
            )}

            {selectedDay && notes[selectedDay] && (
                <div className="day-view">
                    <h3>Заметки на {selectedDay}</h3>
                    {notes[selectedDay].map((n) => (
                        <div key={n.id} className="note-block">
                            <strong>{n.note}</strong>
                            <ul>
                                {n.subtasks.map((st, idx) => <li key={idx}>{st}</li>)}
                            </ul>
                            <small>Важность: {n.importance}</small>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CalendarComponent;
