import javax.enterprise.inject.Model;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.transaction.SystemException;
import javax.transaction.UserTransaction;
import java.util.List;
import javax.inject.Inject;

@Model
public class EntryDao {
    @PersistenceContext(unitName = "WebLab3")
    private EntityManager entityManager;

    @Inject
    private UserTransaction transaction;

    public List<Entry> getEntries(String session_id) {
        try {
            transaction.begin();
            List<Entry> entries = entityManager.createQuery(
                    "select entry from Entry entry where session_id = :session_id order by id", Entry.class)
                    .setParameter("session_id", session_id).getResultList();
            transaction.commit();
            return entries;
        } catch (Exception e) {
            try {
                transaction.rollback();
            } catch (SystemException ex) {
                throw new RuntimeException(ex);
            }
            throw new RuntimeException(e);
        }
    }

    public void add(Entry entry) {
        try {
            transaction.begin();
            entityManager.persist(entry);
            transaction.commit();
        } catch (Exception e) {
            try {
                transaction.rollback();
            } catch (SystemException ex) {
                throw new RuntimeException(ex);
            }
            throw new RuntimeException(e);
        }
    }
}
