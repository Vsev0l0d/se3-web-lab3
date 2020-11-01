import javax.inject.Inject;
import java.io.Serializable;
import java.util.List;
import java.util.UUID;


public class MainBean implements Serializable {
    UUID session_id = UUID.randomUUID();
    @Inject
    private EntryDao entryDao;

    private Entry newEntry;

    public Entry getNewEntry() {
        return newEntry;
    }

    public void setNewEntry(Entry newEntry) {
        this.newEntry = newEntry;
    }

    public MainBean(){
        newEntry = new Entry();
    }

    public List<Entry> getEntries(){
        return entryDao.getEntries(this.session_id.toString());
    }

    public void addEntry(){
        newEntry.setSession_id(session_id.toString());
        newEntry.check();
        entryDao.add(newEntry);
        newEntry = new Entry();
    }
}
